import React, { useState } from 'react';
import Sidebar from 'src\components\Sidebar.jsx';
import test from 'test.jsx';
<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quiz</title>
  <link rel="stylesheet" href="quiz.css" />
  <div className="container">
    {/* Card 1 */}
    <a href="test1.jsx">
      <button className="card">
        <div className="number red-text">1</div>
        <div className="bottom-right">
          <div className="label orange-text">
            <span>50%</span>
            <img src="img\error.png" alt="icon" />
          </div>
        </div>
        <div className="bottom-left">
          <div className="label green-text">
            <img src="img\correct.png" alt="icon" />
            <span className="green-text">50%</span>
          </div>
        </div>
      </button>
    </a>
    {/* Card 2 */}
    <button className="card">
      <div className="number red-text">2</div>
      <div className="bottom-right">
        <div className="label orange-text">
          <span>50%</span>
          <img src="img\error.png" alt="icon" />
        </div>
      </div>
      <div className="bottom-left">
        <div className="label green-text">
          <img src="img\correct.png" alt="icon" />
          <span className="green-text">50%</span>
        </div>
      </div>
    </button>
    {/* Card 1 */}
    <button className="card">
      <div className="number red-text">3</div>
      <div className="bottom-right">
        <div className="label orange-text">
          <span>50%</span>
          <img src="img\error.png" alt="icon" />
        </div>
      </div>
      <div className="bottom-left">
        <div className="label green-text">
          <img src="img\correct.png" alt="icon" />
          <span className="green-text">50%</span>
        </div>
      </div>
    </button>
    {/* Card 1 */}
    <button className="card">
      <div className="number red-text">4</div>
      <div className="bottom-right">
        <div className="label orange-text">
          <span>50%</span>
          <img src="img\error.png" alt="icon" />
        </div>
      </div>
      <div className="bottom-left">
        <div className="label green-text">
          <img src="img\correct.png" alt="icon" />
          <span className="green-text">50%</span>
        </div>
      </div>
    </button>
    {/* Card 1 */}
    <button className="card">
      <div className="number red-text">5</div>
      <div className="bottom-right">
        <div className="label orange-text">
          <span>50%</span>
          <img src="img\error.png" alt="icon" />
        </div>
      </div>
      <div className="bottom-left">
        <div className="label green-text">
          <img src="img\correct.png" alt="icon" />
          <span className="green-text">50%</span>
        </div>
      </div>
    </button>
    {/* Card 1 */}
    <button className="card">
      <div className="number red-text">6</div>
      <div className="bottom-right">
        <div className="label orange-text">
          <span>50%</span>
          <img src="img\error.png" alt="icon" />
        </div>
      </div>
      <div className="bottom-left">
        <div className="label green-text">
          <img src="img\correct.png" alt="icon" />
          <span className="green-text">50%</span>
        </div>
      </div>
    </button>
    {/* Card 1 */}
    <button className="card">
      <div className="number red-text">7</div>
      <div className="bottom-right">
        <div className="label orange-text">
          <span>50%</span>
          <img src="img\error.png" alt="icon" />
        </div>
      </div>
      <div className="bottom-left">
        <div className="label green-text">
          <img src="img\correct.png" alt="icon" />
          <span className="green-text">50%</span>
        </div>
      </div>
    </button>
    {/* Card 1 */}
    <button className="card">
      <div className="number red-text">8</div>
      <div className="bottom-right">
        <div className="label orange-text">
          <span>50%</span>
          <img src="img\error.png" alt="icon" />
        </div>
      </div>
      <div className="bottom-left">
        <div className="label green-text">
          <img src="img\correct.png" alt="icon" />
          <span className="green-text">50%</span>
        </div>
      </div>
    </button>
  </div>
  <div className="pagination">
    <a href="#">«</a>
    <a href="#" className="active">
      1
    </a>
    <a href="#">2</a>
    <a href="#">3</a>
    <a href="#">4</a>
    <a href="#">5</a>
    <a href="#">6</a>
    <a href="#">»</a>
  </div>
</>
