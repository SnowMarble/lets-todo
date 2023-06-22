import { Controller, Get, Post, Put, Delete, Auth } from '@/common/decorators'
import { autoInjectable } from 'tsyringe'
import { TodoService } from './todo.service'
import { UserEntity } from '../user/user.entity'
import { queue } from './stream-queue'
import EventEmitter from 'events'

import type { Request, Response } from 'express'

const eventEmitter = new EventEmitter()

@autoInjectable()
@Controller('/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {
    ;(async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        while (queue.length > 0) {
          const user = await UserEntity.findById(queue[0])
          queue.shift()
          if (!user) continue
          eventEmitter.emit('userEvent', user.props.name)
        }
      }
    })()
  }

  @Auth()
  @Get('/')
  public async get(req: Request) {
    return await this.todoService.get(req.user.id)
  }

  @Auth()
  @Put('/:id')
  public async edit(req: Request) {
    return await this.todoService.edit(req.params.id, req.body)
  }

  @Auth()
  @Post('/')
  public async create(req: Request) {
    return await this.todoService.create(req.body.title, req.user.id)
  }

  @Auth()
  @Delete('/:id')
  public async delete(req: Request) {
    return await this.todoService.delete(req.params.id)
  }

  @Get('/global')
  public async event(req: Request, res: Response) {
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    })
    res.flushHeaders()
    res.nosend = true

    res.write('retry: 10000\n\n')

    const eventHandler = (name: string) => {
      res.write(`data: ${name}\n\n`)
    }

    eventEmitter.on('userEvent', eventHandler)

    req.on('close', () => {
      eventEmitter.off('userEvent', eventHandler)
    })
  }
}
