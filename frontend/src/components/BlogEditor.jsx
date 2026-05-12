import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const BlogEditor = ({ onChange, value }) => {
  return (
    <ReactQuill
      theme="snow"
      onChange={(html) => {
        if (onChange && typeof onChange === 'function') {
          onChange(html)
        }
      }}
      placeholder="Start writing..."
      value={value || ''}
    />
  )
}

export default BlogEditor