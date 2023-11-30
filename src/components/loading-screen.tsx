import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";

const LoadingScreen = () => {
  return <Box sx={{
    width: '100%',
    height: '100%',
  }}>
    <Icon sx={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
      <img
        src={'./fair-protocol-face.svg'}
        style={{
          width: '30%',
          height: '30%',
          display: 'flex',
          alignSelf: 'center',
          boxShadow: '10x 10px 10px 10px #EDEDED',
          transform:'scale(1)',
          filter: 'drop-shadow(0px 0 7px #EDEDED)',
          animation: 'pulse 2s infinite ease-in-out'
        }}
      />
    </Icon>
  </Box>
};

export default LoadingScreen;