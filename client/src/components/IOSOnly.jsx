import { isIOS } from '../utils/userAgent';

function IOSOnly({ children }) {
  const shouldShowChildren = isIOS();

  if (shouldShowChildren) {
    return children;
  }

  return null;
}

export default IOSOnly;
