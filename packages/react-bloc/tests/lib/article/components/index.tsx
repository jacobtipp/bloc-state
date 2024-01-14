import { PropsWithChildren } from 'react';
import {
  BlocProvider,
  MultiRepositoryProvider,
  Provider,
  RepositoryProvider,
  useBlocValue,
  useProvider,
  useRepository,
} from '../../../../src';
import {
  ArticleBloc,
  ArticleClient,
  ArticleRepository,
  IdRepository,
} from '../';

const ArticleClientProvider = ({ children }: PropsWithChildren) => (
  <Provider
    classDef={ArticleClient}
    create={() => new ArticleClient()}
    children={children}
  />
);

const ArticleRepositoryProvider = ({ children }: PropsWithChildren) => {
  const articleClient = useProvider(ArticleClient);
  return (
    <RepositoryProvider
      repository={ArticleRepository}
      create={() => new ArticleRepository(articleClient)}
      dependencies={[articleClient]}
      children={children}
    />
  );
};

const IdRepositoryProvider = ({ children }: PropsWithChildren) => (
  <RepositoryProvider
    repository={IdRepository}
    create={() => new IdRepository()}
    children={children}
  />
);

const ArticleBlocProvider = ({ children }: PropsWithChildren) => {
  const articleRepository = useRepository(ArticleRepository);
  const idRepository = useRepository(IdRepository);
  return (
    <BlocProvider
      bloc={ArticleBloc}
      create={() => {
        const bloc = new ArticleBloc(articleRepository, idRepository);
        bloc.getNewArticle();
        return bloc;
      }}
      dependencies={[articleRepository, idRepository]}
      children={children}
    />
  );
};

export const ArticleConsumer = () => {
  const { id, body } = useBlocValue(ArticleBloc);
  return (
    <div>
      <div data-testid="article-id">{id}</div>
      <div data-testid="article-body">{body}</div>
    </div>
  );
};

export const ArticleFeature = () => (
  <ArticleClientProvider>
    <MultiRepositoryProvider
      providers={[ArticleRepositoryProvider, IdRepositoryProvider]}
    >
      <ArticleBlocProvider>
        <ArticleConsumer />
      </ArticleBlocProvider>
    </MultiRepositoryProvider>
  </ArticleClientProvider>
);
