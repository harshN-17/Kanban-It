import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Sidebar from '../common/Sidebar'
import { setUser } from '../../redux/userSlice'
import assets from '../../assets'

const AppLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);
  const mode = useSelector((state) => state.mode.value);

  const primary = mode ? assets.colors.primary_dark : assets.colors.primary_light;


  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated()
      if (!user) {
        navigate('/login')
      } else {
        // save user
        // console.log(user);
        dispatch(setUser(user));
        setLoading(false);
      }
    }
    checkAuth();
  }, [navigate])

  return (
    loading ? (
      <Loading fullHeight />
    ) : (
      <Box sx={{
        display: 'flex',
        backgroundColor: primary
      }}>
        <Sidebar />
        <Box sx={{
          flexGrow: 1,
          p: 1,
          width: 'max-content'
        }}>
          <Outlet />
        </Box>
      </Box>
    )
  )
}

export default AppLayout