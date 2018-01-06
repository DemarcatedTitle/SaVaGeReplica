// import React from 'react';
// // import logo from '../logo.svg';
// // import frame1 from '../svgimages/svgpaintbrushframes/frame1.svg';
// // import frame2 from '../svgimages/svgpaintbrushframes/frame2.svg';
// // import frame3 from '../svgimages/svgpaintbrushframes/frame3.svg';
// // import frame4 from '../svgimages/svgpaintbrushframes/frame4.svg';
// // import frame5 from '../svgimages/svgpaintbrushframes/frame5.svg';
// // import frame6 from '../svgimages/svgpaintbrushframes/frame6.svg';
// // import frame7 from '../svgimages/svgpaintbrushframes/frame7.svg';
// // import frame8 from '../svgimages/svgpaintbrushframes/frame8.svg';
// // import frame9 from '../svgimages/svgpaintbrushframes/frame9.svg';
// export default class Loading extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = { currentFrame: 0 };
//   }
//   render() {
//     // const animationFrames = [
//     //   // frame1,
//     //   // frame2,
//     //   // frame3,
//     //   // frame4,
//     //   // frame5,
//     //   // frame6,
//     //   frame7,
//     //   frame8,
//     //   frame9,
//     // ];
//     // const totalFrames = animationFrames.length;
//     const test = this;
//     setTimeout(
//       function(totalFrames) {
//         test.setState({
//           currentFrame:
//             test.state.currentFrame < totalFrames - 1
//               ? test.state.currentFrame + 1
//               : 0,
//         });
//       },
//       100,
//       totalFrames
//     );
//     return (
//       <div>
//         <p>Loading...</p>
//         <img
//           src={animationFrames[this.state.currentFrame]}
//           className=""
//           alt="logo"
//         />
//       </div>
//     );
//   }
// }
