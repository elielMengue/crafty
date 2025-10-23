import { type Message, PostMessageUseCase, type PostMessage, DateProvider, MessageTooLongError, EmptyMessageError } from "../post-message.usecase";
import { inMemoryMessageRepository } from "../message.inmemory.repository";


describe("Feature: Posting Messages", () => {

    let fixture: Fixture;
    beforeEach(() => {
            fixture = createFixture();
    })
    describe("Rule: A message can cointain a maximum of 280 characters", () => {
        test("Alice can post a message on her timeline", () => {
            // Given Alice is a user of the system
            fixture.givenNowIs(new Date("2024-06-01T10:00:00Z"));

            fixture.WhenUserPostAMessage({
                id:"message-id",
                text: "Hello, this is my first message on Crafty!",
                author: "alice",
            })

            fixture.thenPostedMessageShouldBe({
                id:"message-id",
                text: "Hello, this is my first message on Crafty!",
                author: "alice",
                publishAt: new Date("2024-06-01T10:00:00Z"),
            })
            test("Alice cannot post a message longer than 280 charactes", () => {
                const textlenght281 = "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

                fixture.givenNowIs(new Date("2024-06-01T11:00:00Z"));

                fixture.WhenUserPostAMessage({
                    id:"message-id-2",
                    text: textlenght281,
                    author: "alice",

                })

                fixture.thenErrorShouldBe(MessageTooLongError);
            })

        });
    });

    describe("Rule: A message cannot be empty", () => {
        test("Alice cannot post an empty message", () => {
            fixture.givenNowIs(new Date("2024-06-01T12:00:00Z"));

            fixture.WhenUserPostAMessage({
                id:"message-id-3",
                text: "",
                author: "alice",
            })

            fixture.thenErrorShouldBe(EmptyMessageError);
        
    });

    test("Alice cannot post a message with only whitespaces", () => {
            fixture.givenNowIs(new Date("2024-06-01T12:00:00Z"));

            fixture.WhenUserPostAMessage({
                id:"message-id-3",
                text: "  ",
                author: "alice",
            })

            fixture.thenErrorShouldBe(EmptyMessageError);
        
    });
});
});








// In-memory representation of the posted message

class StubDateProvider implements DateProvider {
    now: Date = new Date();
    getNow(): Date {
        return this.now;
    }
}








const createFixture = () => {
    let thrownError: Error ;
    const messageRepository = new inMemoryMessageRepository();
    const dateProvider = new StubDateProvider();
    const postMessageUseCase =  new PostMessageUseCase(messageRepository, dateProvider)
    
    return {
        givenNowIs(_now: Date) {
            dateProvider.now = _now;
        }, 
        WhenUserPostAMessage(PostMessage: PostMessage) {
               try{
                        postMessageUseCase.handle(PostMessage);
                }catch(error){
                    thrownError = error as Error;
                }
        },

thenPostedMessageShouldBe(ExpectedMessage: Message){
    expect(ExpectedMessage).toEqual(messageRepository.message)
},

thenErrorShouldBe(expectedErrorClass: new (...args: any[]) => Error){
    expect(thrownError).toBeInstanceOf(expectedErrorClass)
}

        

    }
}

type Fixture = ReturnType<typeof createFixture>;