import Panel from '../components/Panel/Panel'
import ProtectedRoute from '../components/Panel/ProtectedRoute'

const PanelPage = () => {
  return (
    <ProtectedRoute>
     <Panel/>
    </ProtectedRoute>
  )
}

export default PanelPage