import { Cubit } from '@jacobtipp/bloc';

type Article = {
  id: number;
  body: string;
};

export class ArticleClient {
  async getArticle() {
    return Promise.resolve({
      body: 'new article',
    });
  }
}

export class ArticleRepository {
  constructor(private readonly articleClient: ArticleClient) {}
  async getArticle() {
    return this.articleClient.getArticle();
  }
}

export class IdRepository {
  async createId() {
    return Promise.resolve(1);
  }
}

export class ArticleBloc extends Cubit<Article> {
  constructor(
    private articleRepo: ArticleRepository,
    private idRepository: IdRepository
  ) {
    super({
      id: 0,
      body: 'initial article',
    });
  }

  getNewArticle = async () => {
    const newId = await this.idRepository.createId();
    const newArticle = await this.articleRepo.getArticle();
    if (!this.isClosed)
      this.emit({
        id: newId,
        body: newArticle.body,
      });
  };
}
