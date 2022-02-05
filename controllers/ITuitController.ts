interface ITuitController extends IController {
  findByUser(req: Request, res: Response): void;
}
