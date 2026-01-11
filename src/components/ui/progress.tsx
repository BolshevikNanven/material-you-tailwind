'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'
const CONSTANTS = {
    line: {
        frequency: 0.1, // 线性波浪频率
        amplitude: 2.4, // 最大振幅
    },
    circle: {
        frequency: 8, // 环形波浪频率 (一圈几个波峰)
        amplitude: 1.5, // 环形最大振幅
    },
}

function useWaveAnimation(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    value: number,
    wave: boolean,
    variant: 'line' | 'circle',
    stroke: number,
) {
    const dataRef = React.useRef({ value, wave, variant })

    React.useEffect(() => {
        dataRef.current = { value, wave, variant }
    }, [value, wave, variant])

    React.useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let frameId: number
        let phase = 0
        let currentAmplitude = 0

        const getColors = () => {
            const style = getComputedStyle(canvas)
            const primary = style.color || '#000'
            let secondary = style.getPropertyValue('--secondary-container').trim()
            if (!secondary) secondary = 'rgba(0, 0, 0, 0.1)'
            return { primary, secondary }
        }

        const renderLine = (width: number, height: number, colors: { primary: string }, amp: number) => {
            const { frequency } = CONSTANTS.line
            const centerY = height / 2
            const padding = stroke / 2

            ctx.beginPath()
            ctx.strokeStyle = colors.primary
            ctx.lineWidth = stroke
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            if (width > padding * 2) {
                if (amp < 0.05) {
                    ctx.moveTo(padding, centerY)
                    ctx.lineTo(width - padding, centerY)
                } else {
                    for (let x = padding; x <= width - padding; x++) {
                        const y = centerY + Math.sin(1.4 * x * frequency - phase) * amp
                        if (x === padding) ctx.moveTo(x, y)
                        else ctx.lineTo(x, y)
                    }
                }
                ctx.stroke()
            }
        }

        const renderCircle = (
            width: number,
            height: number,
            colors: { primary: string; secondary: string },
            amp: number,
            progress: number,
        ) => {
            const { frequency, amplitude: maxAmp } = CONSTANTS.circle
            const centerX = width / 2
            const centerY = height / 2

            // 半径安全计算 (Anti-Clipping)
            // 公式：最大可用半径 - (线宽一半 + 最大振幅 + 安全边距)
            const maxAvailableRadius = Math.min(width, height) / 2
            const safePadding = stroke / 2 + maxAmp + 2.5
            const radius = maxAvailableRadius - safePadding

            // 如果容器太小导致半径为负，直接不画
            if (radius <= 0) return

            // 基础角度设置 (-90度为起点)
            const startAngle = -Math.PI / 2
            const fullCircle = Math.PI * 2
            const progressRatio = Math.max(0, Math.min(1, progress / 100))
            const currentProgressAngle = progressRatio * fullCircle
            const endAngle = startAngle + currentProgressAngle

            // 计算像素间距对应的弧度 (Gap)
            const gapRadian = (4 + stroke) / radius

            // 绘制背景轨道 (Track) ---
            // 逻辑：只画“剩余部分”，并且头尾都要缩进 gapRadian
            // 只有当进度还没满一圈的时候才画轨道
            if (progress < 100) {
                ctx.beginPath()
                ctx.strokeStyle = colors.secondary
                ctx.lineWidth = stroke
                ctx.lineCap = 'round'

                // 轨道起点：进度结束点 + 间隙
                const trackStart = endAngle + gapRadian
                // 轨道终点：转一圈回到起点 - 间隙
                const trackEnd = startAngle + fullCircle - gapRadian

                // 只有当轨道长度仍然大于0时才绘制 (避免 gap 互相交叉)
                if (trackStart < trackEnd) {
                    ctx.arc(centerX, centerY, radius, trackStart, trackEnd)
                    ctx.stroke()
                }
            }

            // --- B. 绘制前景波浪 (Wave) ---
            if (progress > 0) {
                ctx.beginPath()
                ctx.strokeStyle = colors.primary
                ctx.lineWidth = stroke
                ctx.lineCap = 'round'

                // 如果振幅极小，降级为普通圆弧绘制 (性能优化)
                if (amp < 0.1) {
                    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
                } else {
                    const step = Math.PI / 180
                    for (let angle = startAngle; angle <= endAngle; angle += step) {
                        // 极坐标波浪
                        const waveOffset = Math.sin(angle * frequency - phase) * amp
                        // R = 安全半径 + 波动
                        const r = radius + waveOffset

                        const x = centerX + r * Math.cos(angle)
                        const y = centerY + r * Math.sin(angle)

                        if (angle === startAngle) ctx.moveTo(x, y)
                        else ctx.lineTo(x, y)
                    }
                    // 确保终点闭合
                    const finalWaveOffset = Math.sin(endAngle * frequency - phase) * amp
                    const finalR = radius + finalWaveOffset
                    ctx.lineTo(centerX + finalR * Math.cos(endAngle), centerY + finalR * Math.sin(endAngle))
                }
                ctx.stroke()
            }
        }

        const render = () => {
            const { value: currentValue, wave: isWave, variant: currentVariant } = dataRef.current

            const dpr = window.devicePixelRatio || 1
            const rect = canvas.getBoundingClientRect()

            // 响应式布局
            // 每一帧都检测 DOM 元素的实际大小，并更新 Canvas 的内部分辨率
            if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                canvas.width = rect.width * dpr
                canvas.height = rect.height * dpr
                ctx.scale(dpr, dpr)
            }

            const { width, height } = rect
            const colors = getColors()

            ctx.clearRect(0, 0, width, height)

            const config = CONSTANTS[currentVariant]
            const shouldWave = isWave && currentValue > 2 && currentValue < 99
            const targetAmplitude = shouldWave ? config.amplitude : 0

            // 缓动
            currentAmplitude += (targetAmplitude - currentAmplitude) * 0.1

            if (Math.abs(currentAmplitude) > 0.01) {
                phase -= 0.08
            }

            if (currentVariant === 'circle') {
                renderCircle(width, height, colors, currentAmplitude, currentValue)
            } else {
                renderLine(width, height, colors, currentAmplitude)
            }

            frameId = requestAnimationFrame(render)
        }

        render()
        return () => cancelAnimationFrame(frameId)
    }, [canvasRef, stroke])
}

function Progress({
    className,
    value,
    variant = 'line',
    stroke = 4,
    wave = false,
    ref,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { wave?: boolean; variant?: 'line' | 'circle'; stroke?: number }) {
    value = value || 0
    stroke = stroke > 4 ? stroke : 4

    const valueRef = React.useRef(value)

    React.useEffect(() => {
        valueRef.current = value
    }, [value])

    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    useWaveAnimation(canvasRef as React.RefObject<HTMLCanvasElement>, value || 0, wave, variant, stroke)

    if (variant === 'circle') {
        return (
            <div className={cn('relative inline-flex h-12 w-12 items-center justify-center', className)} {...props}>
                <canvas ref={canvasRef} className='h-full w-full text-primary' />
            </div>
        )
    }

    return (
        <ProgressPrimitive.Root
            ref={ref}
            data-slot='progress'
            className={cn('flex w-full items-center overflow-hidden', className)}
            style={{ height: `${wave ? stroke + 6 : stroke}px` }}
            value={value}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot='progress-indicator'
                className={cn('mr-1 h-full transition-[width]')}
                style={{
                    width: `${value || 0}%`,
                }}
            >
                <canvas ref={canvasRef} className='h-full w-full text-primary' />
            </ProgressPrimitive.Indicator>
            <div
                className={cn('flex flex-1 flex-row-reverse items-center overflow-hidden rounded-full bg-secondary-container')}
                style={{ height: `${stroke}px` }}
            >
                <span className='aspect-square h-full rounded-full bg-primary' />
            </div>
        </ProgressPrimitive.Root>
    )
}

export { Progress }
