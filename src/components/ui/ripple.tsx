'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useRef } from 'react'

const PRESS_GROW_MS = 450
const MINIMUM_PRESS_MS = 225
const INITIAL_ORIGIN_SCALE = 0.18
const PADDING = 10
const SOFT_EDGE_MINIMUM_SIZE = 75
const SOFT_EDGE_CONTAINER_RATIO = 0.35
const TOUCH_DELAY_MS = 150
const ANIMATION_FILL = 'forwards'

const State = {
    INACTIVE: 0,
    TOUCH_DELAY: 1, // 触摸按下，等待判断是点击还是滚动
    HOLDING: 2, // 确认为长按
    WAITING_FOR_CLICK: 3, // 等待手指抬起
} as const
type State = (typeof State)[keyof typeof State]

interface RippleProps {
    disabled?: boolean
    className?: string
    opacity?: number
}

export const Ripple: React.FC<RippleProps> = ({ disabled = false, className = '', opacity = 0.12 }) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const waveRef = useRef<HTMLDivElement>(null)

    const state = useRef<State>(State.INACTIVE)
    const rippleStartEvent = useRef<PointerEvent | null>(null)
    const growAnimation = useRef<Animation | null>(null)
    const checkBoundsAfterAnim = useRef(false)

    const isTouch = (event: PointerEvent) => event.pointerType === 'touch'

    const shouldReactToEvent = (event: PointerEvent) => {
        if (disabled || !event.isPrimary) return false

        if (rippleStartEvent.current && rippleStartEvent.current.pointerId !== event.pointerId) {
            return false
        }

        if (event.type === 'pointerenter' || event.type === 'pointerleave') {
            return !isTouch(event)
        }

        const isPrimaryButton = event.buttons === 1
        return isTouch(event) || isPrimaryButton
    }

    // 计算涟漪的尺寸和缩放比例
    const determineRippleSize = (rect: DOMRect) => {
        const { height, width } = rect
        const maxDim = Math.max(height, width)
        const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE)

        const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE)
        const hypotenuse = Math.sqrt(width ** 2 + height ** 2)
        const maxRadius = hypotenuse + PADDING

        const rippleScale = (maxRadius + softEdgeSize) / initialSize
        const rippleSize = `${initialSize}px`

        return { initialSize, rippleScale, rippleSize }
    }

    // 获取点击位置相对于元素的坐标
    const getNormalizedPointerEventCoords = (pointerEvent: PointerEvent, rect: DOMRect) => {
        const { scrollX, scrollY } = window
        const { left, top } = rect
        const documentX = scrollX + left
        const documentY = scrollY + top
        const { pageX, pageY } = pointerEvent

        return {
            x: pageX - documentX,
            y: pageY - documentY,
        }
    }

    // 计算动画的起始点和结束点
    const getTranslationCoordinates = (rect: DOMRect, initialSize: number, positionEvent?: PointerEvent) => {
        const { height, width } = rect

        // 终点是中心
        const endPoint = {
            x: (width - initialSize) / 2,
            y: (height - initialSize) / 2,
        }

        let startPoint
        if (positionEvent instanceof PointerEvent) {
            startPoint = getNormalizedPointerEventCoords(positionEvent, rect)
        } else {
            // 键盘触发时，从中心开始
            startPoint = {
                x: width / 2,
                y: height / 2,
            }
        }

        // 将中心对齐到点击点
        startPoint = {
            x: startPoint.x - initialSize / 2,
            y: startPoint.y - initialSize / 2,
        }

        return { startPoint, endPoint }
    }

    // --- 动画控制 ---

    const startPressAnimation = (positionEvent?: PointerEvent) => {
        if (!rootRef.current || !waveRef.current) return

        // 显示涟漪层
        waveRef.current.classList.remove('opacity-0')
        waveRef.current.style.transitionDuration = '68ms'
        waveRef.current.style.opacity = opacity.toString()

        // 如果有正在进行的动画，取消它
        if (growAnimation.current) {
            growAnimation.current.cancel()
        }

        const rect = rootRef.current.getBoundingClientRect()
        const { initialSize, rippleScale, rippleSize } = determineRippleSize(rect)
        const { startPoint, endPoint } = getTranslationCoordinates(rect, initialSize, positionEvent)

        const translateStart = `${startPoint.x}px, ${startPoint.y}px`
        const translateEnd = `${endPoint.x}px, ${endPoint.y}px`

        growAnimation.current = waveRef.current.animate(
            {
                top: [0, 0],
                left: [0, 0],
                height: [rippleSize, rippleSize],
                width: [rippleSize, rippleSize],
                transform: [`translate(${translateStart}) scale(1)`, `translate(${translateEnd}) scale(${rippleScale})`],
            },
            {
                duration: PRESS_GROW_MS,
                easing: 'cubic-bezier(0.2, 0, 0, 1.0)',
                fill: ANIMATION_FILL,
            },
        )
    }

    const endPressAnimation = async () => {
        rippleStartEvent.current = null
        state.current = State.INACTIVE

        const animation = growAnimation.current
        let pressAnimationPlayState = Infinity

        if (animation && typeof animation.currentTime === 'number') {
            pressAnimationPlayState = animation.currentTime
        }

        // 如果按下的时间太短，强制等待到最小时间 (225ms)，保证视觉完整性
        if (pressAnimationPlayState < MINIMUM_PRESS_MS) {
            checkBoundsAfterAnim.current = true
            await new Promise(resolve => {
                setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState)
            })
        }

        if (growAnimation.current !== animation) {
            // 在等待期间开始了新的动画，取消当前的结束逻辑
            return
        }

        if (waveRef.current) {
            // 淡出效果
            waveRef.current.style.transitionDuration = '300ms'
            waveRef.current.style.opacity = '0'
        }
    }

    const handlePointerLeave = (event: PointerEvent) => {
        if (!shouldReactToEvent(event)) return

        // 如果手指移出元素，结束按压状态
        if (state.current !== State.INACTIVE) {
            endPressAnimation()
        }
    }

    const handlePointerUp = (event: PointerEvent) => {
        if (!shouldReactToEvent(event)) return

        if (state.current === State.HOLDING) {
            state.current = State.WAITING_FOR_CLICK
            return
        }

        if (state.current === State.TOUCH_DELAY) {
            state.current = State.WAITING_FOR_CLICK
            startPressAnimation(rippleStartEvent.current!)
            return
        }
    }

    const handlePointerDown = async (event: PointerEvent) => {
        if (!shouldReactToEvent(event)) return

        rippleStartEvent.current = event

        // 鼠标点击，直接开始
        if (!isTouch(event)) {
            state.current = State.WAITING_FOR_CLICK
            startPressAnimation(event)
            return
        }

        // 触摸点击，进入延时状态 (防止滚动误触)
        state.current = State.TOUCH_DELAY
        await new Promise(resolve => setTimeout(resolve, TOUCH_DELAY_MS))

        if (state.current !== State.TOUCH_DELAY) {
            return
        }

        state.current = State.HOLDING
        startPressAnimation(event)
    }

    const handleClick = () => {
        if (disabled) return

        if (state.current === State.WAITING_FOR_CLICK) {
            endPressAnimation()
            return
        }

        if (state.current === State.INACTIVE) {
            // 键盘触发的点击 (Enter/Space)
            startPressAnimation()
            endPressAnimation()
        }
    }

    const handlePointerCancel = (event: PointerEvent) => {
        if (!shouldReactToEvent(event)) return
        endPressAnimation()
    }

    // --- 挂载逻辑 ---
    useEffect(() => {
        const parent = rootRef.current?.parentElement
        if (!parent) return

        const style = window.getComputedStyle(parent)
        if (style.position === 'static') {
            parent.style.position = 'relative'
        }

        // 绑定事件到父元素
        parent.addEventListener('click', handleClick)
        parent.addEventListener('contextmenu', endPressAnimation)
        parent.addEventListener('pointercancel', handlePointerCancel)
        parent.addEventListener('pointerdown', handlePointerDown)
        parent.addEventListener('pointerleave', handlePointerLeave)
        parent.addEventListener('pointerup', handlePointerUp)

        return () => {
            parent.removeEventListener('click', handleClick)
            parent.removeEventListener('contextmenu', endPressAnimation)
            parent.removeEventListener('pointercancel', handlePointerCancel)
            parent.removeEventListener('pointerdown', handlePointerDown)
            parent.removeEventListener('pointerleave', handlePointerLeave)
            parent.removeEventListener('pointerup', handlePointerUp)
        }
    }, [disabled])

    if (disabled) return null

    return (
        <div
            ref={rootRef}
            aria-hidden='true'
            data-ripple='true'
            className={cn(`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]`, className)}
        >
            {/* Ripple Wave Layer */}
            <div
                ref={waveRef}
                className={`absolute inset-0 opacity-0 transition-opacity ease-linear`}
                style={{
                    background: `radial-gradient(closest-side, currentColor 80%, transparent 100%)`,
                }}
            />
        </div>
    )
}
