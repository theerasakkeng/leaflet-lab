const scaleBar = (zoomlevel) => {
  let scalevalue = null;
  switch (zoomlevel) {
    case 2:
      scalevalue = "3,000,000";
      break;
    case 3:
      scalevalue = "1,000,000";
      break;
    case 4:
      scalevalue = "500,000";
      break;
    case 5:
      scalevalue = "300,000";
      break;
    case 6:
      scalevalue = "200,000";
      break;
    case 7:
      scalevalue = "100,000";
      break;
    case 8:
      scalevalue = "50,000";
      break;
    case 9:
      scalevalue = "20,000";
      break;
    case 10:
      scalevalue = "10,000";
      break;
    case 11:
      scalevalue = "5,000";
      break;
    case 12:
      scalevalue = "3,000";
      break;
    case 13:
      scalevalue = "1,000";
      break;
    case 14:
      scalevalue = "500";
      break;
    case 15:
      scalevalue = "300";
      break;
    case 16:
      scalevalue = "200";
      break;
    case 17:
      scalevalue = "100";
      break;
    case 18:
      scalevalue = "50";
      break;
    case 19:
      scalevalue = "20";
      break;
  }
  document.querySelector(".scale-value").innerHTML = scalevalue;
};
