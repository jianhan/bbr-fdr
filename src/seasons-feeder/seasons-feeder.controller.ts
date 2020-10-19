import { Controller } from '@nestjs/common';

import { EventPattern } from '@nestjs/microservices'

@Controller('seasons-feeder')
export class SeasonsFeederController {

    @EventPattern('fetch_summary')
    async handleFetchSummary(data: Record<string, unknown>) {
        console.log('test')
    }

}
