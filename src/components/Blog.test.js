/** @jest-environment jsdom */
import React from 'react'
import'@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {

  let component
  let mockHandler

  beforeEach(() => {
    const user = {
      username: 'User Name'
    }

    const blog = {
      title: 'Testing components with react',
      author: 'Testi Henkilo',
      url: 'www.testi.urli',
      likes: 12,
      user: user
    }

    mockHandler = jest.fn()

    component = render(
      <Blog blog={blog}  user={user} handleLike={mockHandler}/>
    )

    // component.debug()
  })

  test('renders only title and author', () => {
    expect(component.container).toHaveTextContent(
      'Testing components with react Testi Henkilo'
    )

    const div = component.container.querySelector('.dropdown')
    expect(div).toHaveStyle(
      'display: none'
    )
  })

  test('clicking button reveals correct content', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.dropdown')
    expect(div).not.toHaveStyle('display: none')

    expect(div).toHaveTextContent(
      'www.testi.url'
    )

    expect(div).toHaveTextContent(
      'likes 12'
    )
  })

  test('clicking like calls correct function', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})