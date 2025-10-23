

export type PostMessage = {
    id: string;
    text: string;
    author: string;
    publishAt?: Date;
}


export type Message = {
    id: string; 
    text:string; 
    author:string; 
    publishAt?: Date
}; 


export interface MessageRepository {
    save(message: Message): void;
}


export interface DateProvider {
    getNow(): Date;
}


export class PostMessageUseCase {
    constructor(private readonly messageRepository: MessageRepository, private readonly dateProvider: DateProvider) {}

    handle(PostMessage: PostMessage) {

        if(PostMessage.text.length > 280){
            throw new MessageTooLongError();
        }

        if(PostMessage.text.trim().length === 0){
            throw new EmptyMessageError();
        }
        this.messageRepository.save( {
            id: PostMessage.id,
            text: PostMessage.text,
            author: PostMessage.author,
            publishAt: this.dateProvider.getNow(),
    });
    
    }
}

export class MessageTooLongError extends Error {}

export class EmptyMessageError extends Error {}