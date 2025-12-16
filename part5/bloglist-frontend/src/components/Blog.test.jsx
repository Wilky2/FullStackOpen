import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: {
        username: 'blog',
        name: 'blog',
        id: '6908efcc9c8cec0c4aed2204'
    },
    id: '691361206549fc4e788a5995'
}

test('default rendering of a blog', ()=>{

    const isBlogAddedByConnectedUserMock = vi.fn(blog=>true)

    render(<Blog blog={blog} isBlogAddedByConnectedUser={isBlogAddedByConnectedUserMock}/>)

    const authorElement = screen.getByText(blog.author, { exact: false })
    const titleElement = screen.getByText(blog.title, { exact: false })

    const urlElement = screen.getByText(blog.url, { exact: false })
    const likesElement = screen.getByText(blog.likes, { exact: false })

    expect(authorElement).toBeVisible()
    expect(titleElement).toBeVisible()

    expect(urlElement).not.toBeVisible()
    expect(likesElement).not.toBeVisible()

})

test('url and like are visible when clicked the button controlling the show detail', async ()=>{

    const isBlogAddedByConnectedUserMock = vi.fn(blog=>true)

    render(<Blog blog={blog} isBlogAddedByConnectedUser={isBlogAddedByConnectedUserMock}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const authorElement = screen.getByText(blog.author, { exact: false })
    const titleElement = screen.getByText(blog.title, { exact: false })

    const urlElement = screen.getByText(blog.url, { exact: false })
    const likesElement = screen.getByText(blog.likes, { exact: false })

    expect(authorElement).toBeVisible()
    expect(titleElement).toBeVisible()

    expect(urlElement).toBeVisible()
    expect(likesElement).toBeVisible()

})

test('clicking like button twice calls the event handler twice', async ()=>{

    const isBlogAddedByConnectedUserMock = vi.fn(blog=>true)

    const handleLikeMock = vi.fn()

    render(<Blog blog={blog} handleLike={handleLikeMock} isBlogAddedByConnectedUser={isBlogAddedByConnectedUserMock}/>)

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(handleLikeMock.mock.calls).toHaveLength(2)

})