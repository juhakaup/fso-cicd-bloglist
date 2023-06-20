describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:8080/api/testing/reset')
    const user = {
      name: 'Testi Henkilo',
      username: 'testi',
      password: 'salaatti'
    }
    cy.request('POST', 'http://localhost:8080/api/users/', user)
    cy.visit('http://localhost:8080')
  })

  it('login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('input[name="Username"]').type('testi')
      cy.get('input[name="Password"]').type('salaatti')
      cy.get('#login-button').click()
      cy.contains('logged in succesfully')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('input[name="Username"]').type('admin')
      cy.get('input[name="Password"]').type('salasana')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input[name="Username"]').type('testi')
      cy.get('input[name="Password"]').type('salaatti')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.contains('create new')
      cy.get('input[name="title"]').type('this is a test blog')
      cy.get('input[name="author"]').type('Testi bloggaaja')
      cy.get('input[name="url"]').type('www.dot.not')
      cy.get('#create-button').click()
      cy.contains('this is a test blog Testi bloggaaja')
    })
  })

  describe('Logged in user can', function() {
    beforeEach(function() {
      cy.login({ username: 'testi', password: 'salaatti' })
      cy.createBlog({ title: 'this is a test blog', author: 'Testi bloggaaja', url: 'www.dot.not' })
    })

    it('Like a blog', function() {
      cy.get('#view-button').click()
      cy.contains('likes 0')
      cy.get('#like-button').click()
      cy.contains('likes 1')
    })
  })

  // describe('After creating multiple blogs', function() {
  //   it('the blogs are ordered by most likes', function() {
  //     cy.login({ username: 'testi', password: 'salaatti' })
  //     cy.createBlog({ title: 'testiblogi 1', author: 'Testi bloggaaja', url: 'www.dot.not' })
  //     cy.createBlog({ title: 'testiblogi 2', author: 'Testi bloggaaja', url: 'www.dot.not' })
  //     cy.createBlog({ title: 'testiblogi 3', author: 'Testi bloggaaja', url: 'www.dot.not' })

  //     cy.contains('testiblogi 3')
  //       .contains('view')
  //       .click()
  //       .parent().find('#like-button')
  //       .click()

  //     cy.contains('testiblog').should('contain', 'testiblogi 3')

  //     cy.contains('testiblogi 2')
  //       .contains('view')
  //       .click()
  //       .parent().find('#like-button')
  //       .click().click()

  //     cy.contains('testiblog').should('contain', 'testiblogi 2')
  //   })
  // })
})