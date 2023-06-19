/** @jest-environment jsdom */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from'./BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createNewBlog = jest.fn()

  const component = render(
    <BlogForm createNewBlog={createNewBlog} />
  )

  const title = component.container.querySelector('input[name="title"]')
  const author = component.container.querySelector('input[name="author"]')
  const url = component.container.querySelector('input[name="url"]')

  const form = component.container.querySelector('form')


  fireEvent.change(title, {
    target: { value: 'testing forms' }
  })
  fireEvent.change(author, {
    target: { value: 'Testi Tero' }
  })
  fireEvent.change(url, {
    target: { value: 'www.noaddress.com' }
  })
  fireEvent.submit(form)
  // component.debug()

  expect(createNewBlog.mock.calls).toHaveLength(1)
  expect(createNewBlog.mock.calls[0][0].title).toBe('testing forms')
  expect(createNewBlog.mock.calls[0][0].author).toBe('Testi Tero')
  expect(createNewBlog.mock.calls[0][0].url).toBe('www.noaddress.com')
})