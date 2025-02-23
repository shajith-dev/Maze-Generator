import "./App.css";
import React, { useEffect, useState } from "react";

export default function Sort() {
  const [arr, setArr] = useState([]);
  const [swap, setSwap] = useState([]);
  const [size, setSize] = useState(25);

  // Generate a random array of given size
  function genRandomArray() {
    const tmp = [];
    for (let i = 0; i < size; i++) {
      tmp.push(
        Math.floor(Math.random() * (window.innerHeight > 900 ? 800 : 300) + 5)
      );
    }
    setArr(tmp);
    setSwap([]);
    return tmp;
  }

  // Helper delay function for animations
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Insertion Sort (existing)
  async function iSort() {
    let tmp = [...arr];
    let n = tmp.length;
    for (let i = 0; i < n; i++) {
      let current = tmp[i];
      let j = i - 1;
      const swp = [];
      while (j >= 0 && current < tmp[j]) {
        swp.push(j);
        tmp[j + 1] = tmp[j];
        j--;
      }
      setSwap(swp);
      setArr([...tmp]);
      await delay(50);
      tmp[j + 1] = current;
      await delay(50);
      setSwap([]);
    }
  }

  // Bubble Sort (existing)
  async function bSort() {
    let tmp = [...arr];
    for (let i = 0; i < tmp.length; i++) {
      for (let j = 0; j < tmp.length - i - 1; j++) {
        const swp = [j, j + 1];
        if (tmp[j] > tmp[j + 1]) {
          [tmp[j], tmp[j + 1]] = [tmp[j + 1], tmp[j]];
        }
        setSwap(swp);
        setArr([...tmp]);
        await delay(50);
      }
      await delay(50);
      setSwap([]);
    }
  }

  // Merge Sort implementation
  async function mSort() {
    let tmp = [...arr];
    await mergeSort(0, tmp.length - 1, tmp);
    setSwap([]);
    setArr([...tmp]);
  }

  // Recursive merge sort helper
  async function mergeSort(l, r, tmp) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    await mergeSort(l, mid, tmp);
    await mergeSort(mid + 1, r, tmp);
    await merge(l, mid, r, tmp);
  }

  // Merge function that merges two sorted halves and animates changes
  async function merge(l, mid, r, tmp) {
    let left = tmp.slice(l, mid + 1);
    let right = tmp.slice(mid + 1, r + 1);
    let i = 0,
      j = 0,
      k = l;
    while (i < left.length && j < right.length) {
      // Highlight current index being updated
      setSwap([k]);
      if (left[i] <= right[j]) {
        tmp[k] = left[i];
        i++;
      } else {
        tmp[k] = right[j];
        j++;
      }
      setArr([...tmp]);
      await delay(50);
      k++;
    }
    while (i < left.length) {
      setSwap([k]);
      tmp[k] = left[i];
      setArr([...tmp]);
      await delay(50);
      i++;
      k++;
    }
    while (j < right.length) {
      setSwap([k]);
      tmp[k] = right[j];
      setArr([...tmp]);
      await delay(50);
      j++;
      k++;
    }
    setSwap([]);
  }

  // Selection Sort implementation
  async function sSort() {
    let tmp = [...arr];
    let n = tmp.length;
    for (let i = 0; i < n; i++) {
      let minIndex = i;
      // Highlight the starting index of unsorted section
      setSwap([minIndex]);
      setArr([...tmp]);
      await delay(50);
      for (let j = i + 1; j < n; j++) {
        // Highlight indices being compared
        setSwap([minIndex, j]);
        if (tmp[j] < tmp[minIndex]) {
          minIndex = j;
        }
        setArr([...tmp]);
        await delay(50);
      }
      if (minIndex !== i) {
        [tmp[i], tmp[minIndex]] = [tmp[minIndex], tmp[i]];
      }
      setArr([...tmp]);
      await delay(50);
    }
    setSwap([]);
  }

  useEffect(() => {
    genRandomArray();
  }, [size]);

  return (
    <div className="page">
      <div className="arr first">
        {arr.map((ele, idx) => (
          <div
            key={idx}
            className="ele"
            style={{
              height: `${ele}px`,
              backgroundColor: swap.includes(idx) ? "#2563eb" : "#333333",
            }}
          ></div>
        ))}
      </div>
      <div className="input-section">
        <div className="input-group">
          <input
            id="sz"
            type="range"
            min={10}
            max={50}
            onChange={(event) => {
              setSize(Number(event.target.value));
            }}
          />
          <div className="speed-value">{size}</div>
        </div>
        <div className="button-group second">
          <button onClick={bSort}>Bubble Sort</button>
          <button onClick={iSort}>Insertion Sort</button>
          <button onClick={mSort}>Merge Sort</button>
          <button onClick={sSort}>Selection Sort</button>
        </div>
      </div>
    </div>
  );
}
