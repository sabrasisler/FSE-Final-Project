// import MessageController from './controllers/messages/MessageController';
// import express, { Express } from 'express';
// import { appendFile } from 'fs';
// import MessageDao from './daos/messages/MessageDao';
// import MessageModel from './mongoose/messages/MessageModel';
// import ConversationModel from './mongoose/messages/ConversationModel';

// interface ICommand {
//   execute(): void;
// }

// class ApiCommandFactory {
//   private static commandMap = new Map<string, ICommand>();
//   public static getInstance(
//     key: string,
//     command: { new (app: Express): ICommand },
//     app: Express,
//     middleware?: string
//   ): ICommand {
//     if (!ApiCommandFactory.commandMap.has(key)) {
//       ApiCommandFactory.commandMap.set(key, new command(app));
//     }
//     const cmd: ICommand | undefined = ApiCommandFactory.commandMap.get(key);
//     if (cmd !== undefined) {
//       cmd.execute();
//       return cmd;
//     }
//     throw new Error('Invalid key');
//   }

//   //   public static executeCommand(key: string) {
//   //     const command: ICommand | undefined = ApiCommandFactory.commandMap.get(key);
//   //     if (command !== undefined) {
//   //       command.execute();
//   //     }
//   //   }
// }

// // class MessagesApiConfig implements ICommand {
// //   private readonly app;
// //   private readonly messageController;
// //   public constructor(app: Express) {
// //     this.messageController = new MessageController(
// //       new MessageDao(MessageModel, ConversationModel)
// //     );
// //     this.app = app;
// //     Object.freeze(this);
// //   }
// //   execute(): void {
// //     this.app.post(
// //       '/api/users/:userId/conversations/',
// //       this.messageController.createConversation
// //     );
// //     this.app.post(
// //       '/api/users/:userId/messages',
// //       this.messageController.createMessage
// //     );
// //     this.app.get(
// //       '/api/users/:userId/messages',
// //       this.messageController.findLatestMessagesByUser
// //     );
// //     this.app.get(
// //       '/api/users/:userId/conversations/:conversationId/messages',
// //       this.messageController.findAllMessagesByConversation
// //     );
// //     this.app.delete(
// //       '/api/users/:userId/messages/:messageId',
// //       this.messageController.deleteMessage
// //     );
// //     this.app.delete(
// //       '/api/users/:userId/conversations/:conversationId',
// //       this.messageController.deleteConversation
// //     );
// //   }
// // }

// const configApis = (app: Express): void => {
//   const apiNames: string[] = ['messages'];

//   const messageApi: ICommand = ApiCommandFactory.getInstance(
//     'messages',
//     MessagesApiConfig,
//     app
//   );
// };
