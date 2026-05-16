import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const BlogEditor = ({ onChange, value, setFocus, setError }) => {
  return (
    <ReactQuill
    value={value}
      onFocus={()=>{setFocus(true); setError('')}}
      onBlur={()=>{setFocus(false)}}
      theme="snow"
      onChange={(html) => {
        if (onChange && typeof onChange === 'function') {
          onChange(html)
        }
      }}
      placeholder="Start writing..."
    />
  )
}

export default BlogEditor