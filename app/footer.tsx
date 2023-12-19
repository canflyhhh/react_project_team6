import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box } from "@mui/material";
import theme from "./_theme/theme";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f3f4',
        p: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              關於我們
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ReactGOGO 致力於讓學生們互相分享課程、生活等資訊，透過資訊交換，創造一個互利互惠的平台！
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              聯絡我們
            </Typography>
            <Typography variant="body2" color="text.secondary">
              您可以透過「連絡我們」發送信件讓我們聽見您的聲音
            </Typography>
            <Typography variant="body2" color="text.secondary">
            或寄送郵件下列 Email：canflyhhh@gmail.com
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://your-website.com/">
              ReactGOGO
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}