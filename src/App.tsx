import Navigation from "@/components/Navigation.component";
import Footnotes from "@/components/Footnotes.component";
import MainContent from "@/components/MainContent.component";
import Postamble from "@/components/Postamble.component";
import Grid from "@mui/material/Grid";
/* import './App.scss' */

function App() {
  return (
    <>
		  <Grid container sx={{ height: "100vh" }} className="h-screen overflow-hidden">
        <Grid item xs={3}>
          <Navigation />
        </Grid>
        <Grid item xs={9}>
          <MainContent />
        </Grid>
      </Grid>

      <Footnotes className="hidden" />
      <Postamble className="hidden" />
    </>
  );
}

export default App;
