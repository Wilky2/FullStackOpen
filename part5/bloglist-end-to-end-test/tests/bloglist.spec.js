import { test, expect } from '@playwright/test';

test.describe('Blog app', () => {
  test.beforeEach( async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'blog',
        username: 'blog',
        password: 'sekret'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('blog')
      await page.getByLabel('password').fill('sekret')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('blog logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('blog')
      await page.getByLabel('password').fill('sekre')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or passsword')).toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('blog')
      await page.getByLabel('password').fill('sekret')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title:').fill('Go To Statement Considered Harmful')
      await page.getByLabel('author:').fill('Edsger W. Dijkstra')
      await page.getByLabel('url:').fill('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')).toBeVisible()
      await expect(page.getByText('a new blog Go To Statement Considered Harmful by Edsger W. Dijkstra added')).toBeVisible()
    })

    test('a new blog can be like', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title:').fill('Go To Statement Considered Harmful')
      await page.getByLabel('author:').fill('Edsger W. Dijkstra')
      await page.getByLabel('url:').fill('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
      await page.getByRole('button', { name: 'create' }).click()

      const createdBlog = page.getByText('Go To Statement Considered Harmful Edsger W. Dijkstra').locator('..')
      await createdBlog.getByRole('button', { name: 'view'}).click()
      await createdBlog.getByRole('button', { name: 'like'}).click()
      await expect(createdBlog.getByText('likes 1')).toBeVisible()
    })

    test('user can delete a blog he created', async ({ page }) => {
      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title:').fill('Go To Statement Considered Harmful')
      await page.getByLabel('author:').fill('Edsger W. Dijkstra')
      await page.getByLabel('url:').fill('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
      await page.getByRole('button', { name: 'create' }).click()

      const createdBlog = page.getByText('Go To Statement Considered Harmful Edsger W. Dijkstra').locator('..')
      await createdBlog.getByRole('button', { name: 'view'}).click()
      await createdBlog.getByRole('button', { name: 'remove'}).click()
      
      await page.evaluate(() => confirm())

      await expect(page.getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')).not.toBeVisible()
    })

    test('only the user who added the blog sees the remove button', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'root',
          username: 'root',
          password: 'sekret'
        }
      })

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title:').fill('Go To Statement Considered Harmful')
      await page.getByLabel('author:').fill('Edsger W. Dijkstra')
      await page.getByLabel('url:').fill('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByLabel('username').fill('root')
      await page.getByLabel('password').fill('sekret')
      await page.getByRole('button', { name: 'login' }).click()

      const createdBlog = page.getByText('Go To Statement Considered Harmful Edsger W. Dijkstra').locator('..')
      await createdBlog.getByRole('button', { name: 'view'}).click()
      await expect(createdBlog.getByRole('button', { name: 'remove'})).not.toBeVisible()
    })
    
    test('Ensures that blogs are sorted', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title:').fill('Go To Statement Considered Harmful')
      await page.getByLabel('author:').fill('Edsger W. Dijkstra')
      await page.getByLabel('url:').fill('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
      await page.getByRole('button', { name: 'create' }).click()

      const notLikedBlog = page.getByText('Go To Statement Considered Harmful').locator('..')
      await notLikedBlog.getByRole('button', { name: 'view'}).click()

      await page.getByLabel('title:').fill('Type wars')
      await page.getByLabel('author:').fill('Robert C. Martin')
      await page.getByLabel('url:').fill('http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
      await page.getByRole('button', { name: 'create' }).click()

      const likedBlog = page.getByText('Type wars Robert C. Martin').locator('..')
      await likedBlog.getByRole('button', { name: 'view'}).click()
      await likedBlog.getByRole('button', { name: 'like'}).click()

      await expect(likedBlog.getByText('likes 1')).toBeVisible()

      const blogsParent = likedBlog.locator('..')

      const blogsParentSnapshot = await blogsParent.ariaSnapshot()

      const expectedResult = `
- text: Type wars Robert C. Martin
- button "hide"
- link "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html":
  - /url: http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html
- text: likes 1
- button "like"
- text: blog
- button "remove"
- text: Go To Statement Considered Harmful Edsger W. Dijkstra
- button "hide"
- link "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html":
  - /url: http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html
- text: likes 0
- button "like"
- text: blog
- button "remove"
`

      expect(blogsParentSnapshot.trim()).toMatch(expectedResult.trim())
      
    })

  })
})