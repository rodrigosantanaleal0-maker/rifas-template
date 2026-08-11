import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export function RouteLoadingBar() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const id = setTimeout(() => setActive(false), 420);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-loading-bar"
          className="fixed left-0 top-0 z-[100] h-0.5 bg-gradient-to-r from-gold-300 via-gold-500 to-violet-500"
          initial={{ width: '0%', opacity: 1 }}
          animate={{ width: '92%' }}
          exit={{ width: '100%', opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
