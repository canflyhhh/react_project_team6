/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { FC, useEffect, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { CirclePicker, CompactPicker, SliderPicker } from 'react-color'

import { io } from 'socket.io-client'
import { drawLine } from '../utils/drawLine'

import {
  Grid, Card, CardContent, Typography, CardActions, Button, Pagination, Stack, Divider
} from "@mui/material";
import { Point } from 'puppeteer'

const socket = io('http://localhost:3001')

interface pageProps { }

type DrawLineProps = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}

const page: FC<pageProps> = ({ }) => {
  const [color, setColor] = useState<string>('#000')
  const { canvasRef, onMouseDown, clear } = useDraw(createLine)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    socket.emit('client-ready')

    socket.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return
      console.log('sending canvas state')
      socket.emit('canvas-state', canvasRef.current.toDataURL())
    })

    socket.on('canvas-state-from-server', (state: string) => {
      console.log('I received the state')
      const img = new Image()
      img.src = state
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
    })

    socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLineProps) => {
      if (!ctx) return console.log('no ctx here')
      drawLine({ prevPoint, currentPoint, ctx, color })
    })

    socket.on('clear', clear)

    return () => {
      socket.off('draw-line')
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('clear')
    }
  }, [canvasRef, clear])

  function createLine({ prevPoint, currentPoint, ctx }: any) {
    socket.emit('draw-line', { prevPoint, currentPoint, color })
    drawLine({ prevPoint, currentPoint, ctx, color })
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={1500}
        height={600}
        className='border border-black rounded-md'
      />
      <SliderPicker color={color} onChange={(e) => setColor(e.hex)} />
      <button
        type='button'
        className='p-2 rounded-md border border-black'
        onClick={() => socket.emit('clear')}>
        Clear canvas
      </button>
    </div>
  )
}

export default page
