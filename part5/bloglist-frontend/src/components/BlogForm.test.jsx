import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('BlogForm /> calls the event handler with the right details', async () => {

    const title = 'Go To Statement Considered Harmful'
    const author = 'Edsger W. Dijkstra'
    const url = 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'

    const createBlogMock = vi.fn()

    render(<BlogForm createBlog={createBlogMock}/>)

    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, title)
    await user.type(authorInput, author)
    await user.type(urlInput, url)
    await user.click(sendButton)

    expect(createBlogMock.mock.calls).toHaveLength(1)

    console.log(createBlogMock.mock.calls)

    expect(createBlogMock.mock.calls[0][0]).toStrictEqual({title,author,url})

})