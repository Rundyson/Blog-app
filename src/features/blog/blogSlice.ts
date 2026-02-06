import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice} from '@reduxjs/toolkit'

interface Blog {
  id: number
  title: string
  content: string
}

interface BlogState {
  blogs: Blog[]
}

const initialState: BlogState = {
  blogs: [],
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload
    },
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.unshift(action.payload)
    },
  },
})

export const { setBlogs, addBlog } = blogSlice.actions
export default blogSlice.reducer
