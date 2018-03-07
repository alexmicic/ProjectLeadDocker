import { JIRAPage } from './app.po';

describe('jira App', () => {
  let page: JIRAPage;

  beforeEach(() => {
    page = new JIRAPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
