interface IController {
  findAll(req: Request, res: Response): void;
  findById(req: Request, res: Response): void;
  create(req: Request, res: Response): void;
  update(req: Request, res: Response): void;
  delete(req: Request, res: Response): void;
}
