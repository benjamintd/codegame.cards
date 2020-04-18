import { motion } from "framer-motion";

export default () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center"
    >
      <div className="loading"></div>
      <style jsx>{`
        .loading::after {
          content: "";
          display: block;
          margin: auto;
          animation: spin 0.8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
          height: 36px;
          width: 36px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='36' height='36' viewBox='0 0 18 18'%3E%3Cdefs%3E%3Cstyle%3E.a%7Bopacity:0.1;%7D.b%7Bfill:%23333;%7D%3C/style%3E%3C/defs%3E%3Cg class='a'%3E%3Cpath d='M13.2426,13.2426A6,6,0,0,1,4.7574,4.7574L2.636,2.636a9,9,0,1,0,12.7279,0L13.2426,4.7574A6,6,0,0,1,13.2426,13.2426Z'/%3E%3C/g%3E%3Cpath class='b' d='M2.636,2.636,4.7574,4.7574a6,6,0,0,1,8.4853,0L15.364,2.636A9,9,0,0,0,2.636,2.636Z'/%3E%3C/svg%3E");
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
};
