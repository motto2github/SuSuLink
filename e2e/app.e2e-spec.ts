import { SusulinkPage } from './app.po';

describe('susulink App', () => {
  let page: SusulinkPage;

  beforeEach(() => {
    page = new SusulinkPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
