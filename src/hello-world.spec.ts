import { sayHello, sayGoodbye } from './';

describe('greetings', () => {
  it('can say hi', () => {
    expect(sayHello()).toEqual({ message: "hi" });
  });
  
  it('can say goodbye', () => {
    expect(sayGoodbye()).toEqual({ message: "goodbye" });
  });
});
