import {useEffect} from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import trafficService from '../../features/traffic/trafficService'

const GuestLayout = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await trafficService.recordVisit();
      } catch (error) {
        console.error("Tracking error:", error);
      }
    };
    
    trackVisit();
  }, []);
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default GuestLayout