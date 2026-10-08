export class LoginPage {
  constructor(page) {
    this.page = page;
    this.userEmailInput = this.page.getByLabel('Email');
    this.passwordInput = this.page.getByRole('textbox', {
      name: 'Text field for the login password',
    });
    this.loginButton = this.page.getByRole('button', {
      name: 'Login',
      exact: true,
    });
  }

  async login(email, password) {
    await this.userEmailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
