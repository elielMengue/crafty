#! /usr/bin/env node
import { Command } from 'commander';
import { PostMessage,PostMessageUseCase, DateProvider} from './src/post-message.usecase';
import {inMemoryMessageRepository }  from './src/message.inmemory.repository';


class RealDateProvider implements DateProvider {
    getNow(): Date {
        return new Date();
    }
}



const dateProvider = new RealDateProvider();
const messageRepository =  new inMemoryMessageRepository();
const postMessageUseCase = new PostMessageUseCase(messageRepository, dateProvider);


const program = new Command();
program.version('0.1.0').description('Crafty CLI').addCommand(
    new Command('post').argument("<user>", "the current user").argument("<message>", "the message to post")
    .action((user: string, message: string) => {
        const postMessage: PostMessage = {
            id: crypto.randomUUID(),
            text: message, 
            author: user,
        }

        try{
            postMessageUseCase.handle(postMessage)
            console.log("Message posted successfully!");
            console.table([messageRepository.message]);
        }catch(error){
            console.error("Error posting message:", (error as Error).message);
            process.exit(1);
        }
    })
);

async function main() {
    await program.parseAsync(process.argv);
}

main();