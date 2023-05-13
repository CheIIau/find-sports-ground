import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import Page404 from 'src/pages/404'

describe('Page 404', async () => {
  const NOT_FOUND_MESSAGE = 'Такой страницы не существует'
  it('Should render the page correctly', async () => {
    render(<Page404 />)
    const text = screen.queryByText(NOT_FOUND_MESSAGE)
    expect(text).not.toBeNull()
  })
})
