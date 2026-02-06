import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { supabase } from '../services/supabase'
import type { RootState } from '../app/store'

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(logout())
  }

  return (
    <div className="wrapper">
      <nav className="navigation">
        <Link to="/" className="m-blog">
          My Blog
        </Link>
        <div className="login-register">
          {!user ? (
            <>
            <div className="LR-wrapper">
                  <Link to="/login"><p>Login</p></Link>
                  |
                <Link to="/register"><p>Register</p></Link>
            </div>
              
                
             
            </>
          ) : (
            <>
            <div className="create-wrapper">
                <Link to="/create" className='btn-create'>Create</Link>
              <button onClick={handleLogout} className='btn-login'>Logout</button>
            </div>
              
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
