import * as React from "react";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const cm = 72 / 2.54;

export default function CreatePdf() {
  const [maxLitre, setMaxLitre] = React.useState("5");
  const [oilPrice, setOilPrice] = React.useState("");
  const [scaleLength, setScaleLength] = React.useState("");
  const [startPrice, setStartPrice] = React.useState("30");
  const [stepPrice, setStepPrice] = React.useState("10");
  const [fontSize, setFontSize] = React.useState("14");
  const [customScale, setCustomScale] = React.useState(false);
  const [customInputs, setCustomInputs] = React.useState([]);

  const openPdf = () => {
    let content = [];
    const intMaxLitre = parseInt(maxLitre);
    const floatLength = parseFloat(scaleLength);
    const floatOilPrice = Math.ceil(parseFloat(oilPrice));
    const floatStepPrice = parseFloat(stepPrice);
    const floatFontSize = parseFloat(fontSize);
    const floatStartPrice = Math.ceil(parseFloat(startPrice));
    if (
      isNaN(intMaxLitre) ||
      intMaxLitre == 0 ||
      isNaN(floatLength) ||
      floatLength == 0 ||
      isNaN(floatOilPrice) ||
      floatOilPrice == 0
    ) {
      alert("ห้ามใส่ค่า 0");
      return;
    }
    if (customScale) {
      let canvas = [];
      let perLitrePrice = [];
      customInputs.reduce((prev, current, index) => {
        let floatCurrent = parseFloat(current);
        let value = {
          type: "line",
          x1: 0,
          y1: (prev + floatCurrent) * cm,
          x2: 5 * cm,
          y2: (prev + floatCurrent) * cm,
        };
        let textValue = {
          text: `${((index + 1) * floatOilPrice) / intMaxLitre}`,
          absolutePosition: {
            x: 5 * cm,
            y: (prev + floatCurrent) * cm - floatFontSize / 2,
          },
        };
        canvas.push(value);
        content.push(textValue);
        perLitrePrice.push(((index + 1) * floatOilPrice) / intMaxLitre);
        return prev + floatCurrent;
      }, 0);

      for (let i = floatStartPrice; i <= floatOilPrice; i += floatStepPrice) {
        i = parseFloat(i.toFixed(2));
        if (perLitrePrice.includes(i)) continue;
        let value = {
          type: "line",
          x1: 0,
          y1: (i / floatOilPrice) * floatLength * cm,
          x2: 3 * cm,
          y2: (i / floatOilPrice) * floatLength * cm,
        };
        let textValue = {
          text: `${i}`,
          absolutePosition: {
            x: 3 * cm,
            y: (i / floatOilPrice) * floatLength * cm - floatFontSize / 2,
          },
        };
        canvas.push(value);
        content.push(textValue);
      }

      content.push({ canvas: canvas });
    } else {
      let canvas = [];
      let perLitrePrice = [];
      for (let i = 1; i <= intMaxLitre; i++) {
        let value = {
          type: "line",
          x1: 0,
          y1: (i / intMaxLitre) * floatLength * cm,
          x2: 5 * cm,
          y2: (i / intMaxLitre) * floatLength * cm,
        };
        let textValue = {
          text: `${(i * floatOilPrice) / intMaxLitre}`,
          absolutePosition: {
            x: 5 * cm,
            y: (i / intMaxLitre) * floatLength * cm - floatFontSize / 2,
          },
        };
        canvas.push(value);
        content.push(textValue);
        perLitrePrice.push((i * floatOilPrice) / intMaxLitre);
      }

      for (let i = floatStartPrice; i <= floatOilPrice; i += floatStepPrice) {
        i = parseFloat(i.toFixed(2));
        if (perLitrePrice.includes(i)) continue;
        let value = {
          type: "line",
          x1: 0,
          y1: (i / floatOilPrice) * floatLength * cm,
          x2: 3 * cm,
          y2: (i / floatOilPrice) * floatLength * cm,
        };
        let textValue = {
          text: `${i}`,
          absolutePosition: {
            x: 3 * cm,
            y: (i / floatOilPrice) * floatLength * cm - floatFontSize / 2,
          },
        };
        canvas.push(value);
        content.push(textValue);
      }

      content.push({ canvas: canvas });
    }

    const docDefinition = {
      pageSize: "A4",
      content: content,
      defaultStyle: {
        fontSize: floatFontSize,
      },
      pageMargins: 0,
    };
    pdfMake.createPdf(docDefinition).open();
  };

  const updateField = (i, e) => {
    let newArr = [...customInputs];
    newArr[i] = e.target.value;
    setCustomInputs(newArr);
  };

  const customInputsFields = (numbers: string) => {
    const list = [];
    for (let i = 0; i < parseInt(numbers); i++) {
      list.push(
        <div key={i}>
          <label>ความห่างช่องที่ {i + 1}</label>
          <input
            type="text"
            pattern="[0-9]*\.?[0-9]*"
            value={customInputs[i] || ""}
            name={`${i}`}
            onChange={(e) => updateField(i, e)}
          />{" "}
          ซม.
        </div>
      );
    }
    return list;
  };

  return (
    <div>
      จำนวนลิตร
      <input
        type="text"
        pattern="[0-9]*\.?[0-9]*"
        value={maxLitre}
        onChange={(e) => {
          e.target.validity.valid ? setMaxLitre(e.target.value) : maxLitre;
        }}
      ></input>
      <br />
      ความยาวสเกล
      <input
        type="text"
        pattern="[0-9]*\.?[0-9]*"
        value={scaleLength}
        onChange={(e) => {
          e.target.validity.valid
            ? setScaleLength(e.target.value)
            : scaleLength;
        }}
      ></input>{" "}
      ซม.
      <br />
      ราคาน้ำมัน
      <input
        type="text"
        pattern="[0-9]*\.?[0-9]*"
        value={oilPrice}
        onChange={(e) => {
          e.target.validity.valid ? setOilPrice(e.target.value) : oilPrice;
        }}
      ></input>{" "}
      บาท
      <br />
      ราคาเริ่มต้น
      <input
        type="text"
        pattern="[0-9]*\.?[0-9]*"
        value={startPrice}
        onChange={(e) => {
          e.target.validity.valid ? setStartPrice(e.target.value) : startPrice;
        }}
      ></input>{" "}
      บาท
      <br />
      เพิ่มทีละ
      <input
        type="text"
        pattern="[0-9]*\.?[0-9]*"
        value={stepPrice}
        onChange={(e) => {
          e.target.validity.valid ? setStepPrice(e.target.value) : stepPrice;
        }}
      ></input>{" "}
      บาท
      <br />
      ขนาดฟอนต์
      <input
        type="text"
        pattern="[0-9]*"
        value={fontSize}
        onChange={(e) => {
          e.target.validity.valid ? setFontSize(e.target.value) : fontSize;
        }}
      ></input>{" "}
      px
      <br />
      <input
        type="checkbox"
        checked={customScale}
        onChange={() => {
          setCustomScale(!customScale);
        }}
        disabled={parseInt(maxLitre) > 0 ? false : true}
      />
      <label>กำหนดความห่างเอง</label>
      {customScale && customInputsFields(maxLitre)}
      <br />
      <button onClick={openPdf}>สร้าง</button>
    </div>
  );
}
