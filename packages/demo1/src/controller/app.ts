import { Controller, Get, Context } from 'nestin'

@Controller('')
class Main {
  name: string;
  constructor() {
    this.name = 'kl';
  }

  @Get('api')
  student(ctx: Context) {
    ctx.body = 'ok';
  }
}

