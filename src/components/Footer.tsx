// import React from "react";
// import Link from "next/link";
// import { Box, Container, Typography, Button } from "@mui/material";

// const Footer: React.FC = () =>
// {
//     return (
//         <Box
//             component="footer"
//             sx={ {
//                 background: "linear-gradient(to right, #6b46c1, #4299e1)",
//                 color: "white",
//                 py: 2,
//                 mt: 10,
//             } }
//         >
//             <Container
//                 maxWidth="lg"
//                 sx={ {
//                     display: "flex",
//                     flexDirection: { xs: "column", md: "row" },
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                 } }
//             >
//                 <Typography variant="body2">
//                     &copy; { new Date().getFullYear() } R-flix. All rights reserved.
//                 </Typography>
//                 <Box
//                     sx={ {
//                         display: "flex",
//                         gap: 2,
//                         mt: { xs: 1, md: 0 },
//                     } }
//                 >
//                     <Button
//                         color="inherit"
//                         component={ Link }
//                         href="/privacy"
//                         sx={ { textTransform: "none" } }
//                     >
//                         Privacy Policy
//                     </Button>
//                     <Button
//                         color="inherit"
//                         component={ Link }
//                         href="/terms"
//                         sx={ { textTransform: "none" } }
//                     >
//                         Terms of Service
//                     </Button>
//                     <Button
//                         color="inherit"
//                         component={ Link }
//                         href="/contact"
//                         sx={ { textTransform: "none" } }
//                     >
//                         Contact Us
//                     </Button>
//                 </Box>
//             </Container>
//         </Box>
//     );
// };

// export default Footer;

'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © 2025 R-flix. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
