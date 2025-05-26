
import {Route, Routes} from 'react-router-dom'
import {Error400} from './components/Error400'
import {Error401} from './components/Error401'
import {Error403} from './components/Error403'
import {Error404} from './components/Error404'
import {Error500} from './components/Error500'
import {Error503} from './components/Error503'
import {Error504} from './components/Error504'
import {ErrorsLayout} from './ErrorsLayout'

const ErrorsPage = () => (
  <Routes>
    <Route element={<ErrorsLayout />}>
      <Route path='400' element={<Error400 />} />
      <Route path='401' element={<Error401 />} />
      <Route path='403' element={<Error403 />} />
      <Route path='404' element={<Error404 />} />
      <Route path='500' element={<Error500 />} />
      <Route path='503' element={<Error503 />} />
      <Route path='504' element={<Error504 />} />
      <Route index element={<Error404 />} />
    </Route>
  </Routes>
)

export {ErrorsPage}
