import React from 'react'

function Dashboard() {
  return (
    <div>
     <section className="section dashboard">
  <div className="row">
    {/* Left side columns */}
    <div className="col-lg-8">
      <div className="row">
        {/* Sales Card */}
        <div className="col-xxl-4 col-md-6">
          <div className="card info-card sales-card">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>
                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>
            <div className="card-body">
              <h5 className="card-title">Sales <span>| Today</span></h5>
              <div className="d-flex align-items-center">
                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bi bi-cart" />
                </div>
                <div className="ps-3">
                  <h6>145</h6>
                  <span className="text-success small pt-1 fw-bold">12%</span> <span className="text-muted small pt-2 ps-1">increase</span>
                </div>
              </div>
            </div>
          </div>
        </div>{/* End Sales Card */}
        {/* Revenue Card */}
        <div className="col-xxl-4 col-md-6">
          <div className="card info-card revenue-card">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>
                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>
            <div className="card-body">
              <h5 className="card-title">Revenue <span>| This Month</span></h5>
              <div className="d-flex align-items-center">
                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bi bi-currency-dollar" />
                </div>
                <div className="ps-3">
                  <h6>$3,264</h6>
                  <span className="text-success small pt-1 fw-bold">8%</span> <span className="text-muted small pt-2 ps-1">increase</span>
                </div>
              </div>
            </div>
          </div>
        </div>{/* End Revenue Card */}
        {/* Customers Card */}
        <div className="col-xxl-4 col-xl-12">
          <div className="card info-card customers-card">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>
                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>
            <div className="card-body">
              <h5 className="card-title">Customers <span>| This Year</span></h5>
              <div className="d-flex align-items-center">
                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bi bi-people" />
                </div>
                <div className="ps-3">
                  <h6>1244</h6>
                  <span className="text-danger small pt-1 fw-bold">12%</span> <span className="text-muted small pt-2 ps-1">decrease</span>
                </div>
              </div>
            </div>
          </div>
        </div>{/* End Customers Card */}
        {/* Reports */}
        <div className="col-12">
          <div className="card">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>
                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>
            <div className="card-body">
              <h5 className="card-title">Reports <span>/Today</span></h5>
              {/* Line Chart */}
              <div id="reportsChart" style={{minHeight: 365}}><div id="apexchartscsowtm1ek" className="apexcharts-canvas apexchartscsowtm1ek apexcharts-theme-" style={{width: 716, height: 350}}><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" className="apexcharts-svg apexcharts-zoomable" xmlns:data="ApexChartsNS" transform="translate(0, 0)" width={716} height={350}><foreignObject x={0} y={0} width={716} height={350}><div className="apexcharts-legend apexcharts-align-center apx-legend-position-bottom" xmlns="http://www.w3.org/1999/xhtml" style={{right: 0, position: 'absolute', left: 0, top: 325, maxHeight: 175}}><div className="apexcharts-legend-series" rel={1} seriesname="Sales" data:collapsed="false" style={{margin: '4px 5px'}}><span className="apexcharts-legend-marker" rel={1} data:collapsed="false" style={{height: 16, width: 16, left: 0, top: 0}}><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" height="100%"><path d="M 0, 0 
     m -7, 0 
     a 7,7 0 1,0 14,0 
     a 7,7 0 1,0 -14,0" fill="#4154f1" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={1} strokeDasharray={0} cx={0} cy={0} shape="circle" className="apexcharts-legend-marker apexcharts-marker apexcharts-marker-circle" style={{transform: 'translate(50%, 50%)'}} /></svg></span><span className="apexcharts-legend-text" rel={1} i={0} data:default-text="Sales" data:collapsed="false" style={{color: 'rgb(55, 61, 63)', fontSize: 12, fontWeight: 400, fontFamily: 'Helvetica, Arial, sans-serif'}}>Sales</span></div><div className="apexcharts-legend-series" rel={2} seriesname="Revenue" data:collapsed="false" style={{margin: '4px 5px'}}><span className="apexcharts-legend-marker" rel={2} data:collapsed="false" style={{height: 16, width: 16, left: 0, top: 0}}><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" height="100%"><path d="M 0, 0 
     m -7, 0 
     a 7,7 0 1,0 14,0 
     a 7,7 0 1,0 -14,0" fill="#2eca6a" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={1} strokeDasharray={0} cx={0} cy={0} shape="circle" className="apexcharts-legend-marker apexcharts-marker apexcharts-marker-circle" style={{transform: 'translate(50%, 50%)'}} /></svg></span><span className="apexcharts-legend-text" rel={2} i={1} data:default-text="Revenue" data:collapsed="false" style={{color: 'rgb(55, 61, 63)', fontSize: 12, fontWeight: 400, fontFamily: 'Helvetica, Arial, sans-serif'}}>Revenue</span></div><div className="apexcharts-legend-series" rel={3} seriesname="Customers" data:collapsed="false" style={{margin: '4px 5px'}}><span className="apexcharts-legend-marker" rel={3} data:collapsed="false" style={{height: 16, width: 16, left: 0, top: 0}}><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" height="100%"><path d="M 0, 0 
     m -7, 0 
     a 7,7 0 1,0 14,0 
     a 7,7 0 1,0 -14,0" fill="#ff771d" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={1} strokeDasharray={0} cx={0} cy={0} shape="circle" className="apexcharts-legend-marker apexcharts-marker apexcharts-marker-circle" style={{transform: 'translate(50%, 50%)'}} /></svg></span><span className="apexcharts-legend-text" rel={3} i={2} data:default-text="Customers" data:collapsed="false" style={{color: 'rgb(55, 61, 63)', fontSize: 12, fontWeight: 400, fontFamily: 'Helvetica, Arial, sans-serif'}}>Customers</span></div></div><style type="text/css" dangerouslySetInnerHTML={{__html: "\n      .apexcharts-flip-y {\n        transform: scaleY(-1) translateY(-100%);\n        transform-origin: top;\n        transform-box: fill-box;\n      }\n      .apexcharts-flip-x {\n        transform: scaleX(-1);\n        transform-origin: center;\n        transform-box: fill-box;\n      }\n      .apexcharts-legend {\n        display: flex;\n        overflow: auto;\n        padding: 0 10px;\n      }\n      .apexcharts-legend.apexcharts-legend-group-horizontal {\n        flex-direction: column;\n      }\n      .apexcharts-legend-group {\n        display: flex;\n      }\n      .apexcharts-legend-group-vertical {\n        flex-direction: column-reverse;\n      }\n      .apexcharts-legend.apx-legend-position-bottom, .apexcharts-legend.apx-legend-position-top {\n        flex-wrap: wrap\n      }\n      .apexcharts-legend.apx-legend-position-right, .apexcharts-legend.apx-legend-position-left {\n        flex-direction: column;\n        bottom: 0;\n      }\n      .apexcharts-legend.apx-legend-position-bottom.apexcharts-align-left, .apexcharts-legend.apx-legend-position-top.apexcharts-align-left, .apexcharts-legend.apx-legend-position-right, .apexcharts-legend.apx-legend-position-left {\n        justify-content: flex-start;\n        align-items: flex-start;\n      }\n      .apexcharts-legend.apx-legend-position-bottom.apexcharts-align-center, .apexcharts-legend.apx-legend-position-top.apexcharts-align-center {\n        justify-content: center;\n        align-items: center;\n      }\n      .apexcharts-legend.apx-legend-position-bottom.apexcharts-align-right, .apexcharts-legend.apx-legend-position-top.apexcharts-align-right {\n        justify-content: flex-end;\n        align-items: flex-end;\n      }\n      .apexcharts-legend-series {\n        cursor: pointer;\n        line-height: normal;\n        display: flex;\n        align-items: center;\n      }\n      .apexcharts-legend-text {\n        position: relative;\n        font-size: 14px;\n      }\n      .apexcharts-legend-text *, .apexcharts-legend-marker * {\n        pointer-events: none;\n      }\n      .apexcharts-legend-marker {\n        position: relative;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        cursor: pointer;\n        margin-right: 1px;\n      }\n\n      .apexcharts-legend-series.apexcharts-no-click {\n        cursor: auto;\n      }\n      .apexcharts-legend .apexcharts-hidden-zero-series, .apexcharts-legend .apexcharts-hidden-null-series {\n        display: none !important;\n      }\n      .apexcharts-inactive-legend {\n        opacity: 0.45;\n      }\n\n    " }} /></foreignObject><rect width={0} height={0} x={0} y={0} rx={0} ry={0} opacity={1} strokeWidth={0} stroke="none" strokeDasharray={0} fill="#fefefe" /><g className="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" /><g className="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" /><g className="apexcharts-yaxis" rel={0} transform="translate(15.359375, 0)"><g className="apexcharts-yaxis-texts-g"><text x={20} y="33.666666666666664" textAnchor="end" dominantBaseline="auto" fontSize="11px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-yaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>100</tspan><title>100</title></text><text x={20} y="86.50666666666666" textAnchor="end" dominantBaseline="auto" fontSize="11px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-yaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>80</tspan><title>80</title></text><text x={20} y="139.34666666666666" textAnchor="end" dominantBaseline="auto" fontSize="11px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-yaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>60</tspan><title>60</title></text><text x={20} y="192.18666666666667" textAnchor="end" dominantBaseline="auto" fontSize="11px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-yaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>40</tspan><title>40</title></text><text x={20} y="245.02666666666667" textAnchor="end" dominantBaseline="auto" fontSize="11px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-yaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>20</tspan><title>20</title></text><text x={20} y="297.8666666666667" textAnchor="end" dominantBaseline="auto" fontSize="11px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-yaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>0</tspan><title>0</title></text></g></g><g className="apexcharts-inner apexcharts-graphical" transform="translate(45.359375, 30)"><defs><clipPath id="gridRectMaskcsowtm1ek"><rect width="666.640625" height="270.2" x={-3} y={-3} rx={0} ry={0} opacity={1} strokeWidth={0} stroke="none" strokeDasharray={0} fill="#fff" /></clipPath><clipPath id="gridRectBarMaskcsowtm1ek"><rect width="666.640625" height="270.2" x={-3} y={-3} rx={0} ry={0} opacity={1} strokeWidth={0} stroke="none" strokeDasharray={0} fill="#fff" /></clipPath><clipPath id="gridRectMarkerMaskcsowtm1ek"><rect width="680.640625" height="284.2" x={-10} y={-10} rx={0} ry={0} opacity={1} strokeWidth={0} stroke="none" strokeDasharray={0} fill="#fff" /></clipPath><clipPath id="forecastMaskcsowtm1ek" /><clipPath id="nonForecastMaskcsowtm1ek" /><linearGradient x1={0} y1={0} x2={0} y2={1} id="SvgjsLinearGradient1003"><stop stopOpacity="0.3" stopColor="rgba(65,84,241,0.3)" offset={0} /><stop stopOpacity="0.4" stopColor="rgba(255,255,255,0.4)" offset="0.9" /><stop stopOpacity="0.4" stopColor="rgba(255,255,255,0.4)" offset={1} /></linearGradient><linearGradient x1={0} y1={0} x2={0} y2={1} id="SvgjsLinearGradient1004"><stop stopOpacity="0.3" stopColor="rgba(46,202,106,0.3)" offset={0} /><stop stopOpacity="0.4" stopColor="rgba(255,255,255,0.4)" offset="0.9" /><stop stopOpacity="0.4" stopColor="rgba(255,255,255,0.4)" offset={1} /></linearGradient><linearGradient x1={0} y1={0} x2={0} y2={1} id="SvgjsLinearGradient1005"><stop stopOpacity="0.3" stopColor="rgba(255,119,29,0.3)" offset={0} /><stop stopOpacity="0.4" stopColor="rgba(255,255,255,0.4)" offset="0.9" /><stop stopOpacity="0.4" stopColor="rgba(255,255,255,0.4)" offset={1} /></linearGradient></defs><line x1={0} y1={0} x2={0} y2="264.2" stroke="#b6b6b6" strokeDasharray={3} strokeLinecap="butt" className="apexcharts-xcrosshairs" x={0} y={0} width={1} height="264.2" fill="#b1b9c4" filter="none" fillOpacity="0.9" strokeWidth={1} /><line x1={0} y1="264.2" x2={0} y2="270.2" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-xaxis-tick" /><line x1="101.63701923076924" y1="264.2" x2="101.63701923076924" y2="270.2" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-xaxis-tick" /><line x1="203.27403846153848" y1="264.2" x2="203.27403846153848" y2="270.2" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-xaxis-tick" /><line x1="304.91105769230774" y1="264.2" x2="304.91105769230774" y2="270.2" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-xaxis-tick" /><line x1="406.54807692307696" y1="264.2" x2="406.54807692307696" y2="270.2" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-xaxis-tick" /><line x1="508.1850961538462" y1="264.2" x2="508.1850961538462" y2="270.2" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-xaxis-tick" /><line x1="609.8221153846155" y1="264.2" x2="609.8221153846155" y2="270.2" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-xaxis-tick" /><g className="apexcharts-grid"><g className="apexcharts-gridlines-horizontal"><line x1={0} y1="52.839999999999996" x2="660.640625" y2="52.839999999999996" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-gridline" /><line x1={0} y1="105.67999999999999" x2="660.640625" y2="105.67999999999999" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-gridline" /><line x1={0} y1="158.51999999999998" x2="660.640625" y2="158.51999999999998" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-gridline" /><line x1={0} y1="211.35999999999999" x2="660.640625" y2="211.35999999999999" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-gridline" /></g><g className="apexcharts-gridlines-vertical" /><line x1={0} y1="264.2" x2="660.640625" y2="264.2" stroke="transparent" strokeDasharray={0} strokeLinecap="butt" /><line x1={0} y1={1} x2={0} y2="264.2" stroke="transparent" strokeDasharray={0} strokeLinecap="butt" /></g><g className="apexcharts-grid-borders"><line x1={0} y1={0} x2="660.640625" y2={0} stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-gridline" /><line x1={0} y1="264.2" x2="660.640625" y2="264.2" stroke="#e0e0e0" strokeDasharray={0} strokeLinecap="butt" className="apexcharts-gridline" /><line x1={0} y1="264.2" x2="660.640625" y2="264.2" stroke="#e0e0e0" strokeDasharray={0} strokeWidth={1} strokeLinecap="butt" /></g><g className="apexcharts-area-series apexcharts-plot-series"><g className="apexcharts-series" zindex={0} seriesname="Sales" data:longestseries="true" rel={1} data:realindex={0}><path d="M 0 182.298C 53.35943509615384 182.298 99.09609375 158.51999999999998 152.45552884615384 158.51999999999998C 188.02848557692306 158.51999999999998 218.51959134615385 190.224 254.09254807692307 190.224C 289.6655048076923 190.224 320.1566105769231 129.458 355.72956730769226 129.458C 391.3025240384615 129.458 421.79362980769224 153.236 457.3665865384615 153.236C 492.93954326923074 153.236 523.4306490384615 47.55600000000001 559.0036057692307 47.55600000000001C 594.5765624999999 47.55600000000001 625.0676682692308 116.24799999999999 660.640625 116.24799999999999C 660.640625 116.24799999999999 660.640625 116.24799999999999 660.640625 264.2 L 0 264.2z" fill="url(#SvgjsLinearGradient1003)" fillOpacity={1} stroke="none" strokeOpacity={1} strokeLinecap="butt" strokeWidth={0} strokeDasharray={0} className="apexcharts-area" index={0} clipPath="url(#gridRectMaskcsowtm1ek)" pathto="M 0 182.298C 53.35943509615384 182.298 99.09609375 158.51999999999998 152.45552884615384 158.51999999999998C 188.02848557692306 158.51999999999998 218.51959134615385 190.224 254.09254807692307 190.224C 289.6655048076923 190.224 320.1566105769231 129.458 355.72956730769226 129.458C 391.3025240384615 129.458 421.79362980769224 153.236 457.3665865384615 153.236C 492.93954326923074 153.236 523.4306490384615 47.55600000000001 559.0036057692307 47.55600000000001C 594.5765624999999 47.55600000000001 625.0676682692308 116.24799999999999 660.640625 116.24799999999999C 660.640625 116.24799999999999 660.640625 116.24799999999999 660.640625 264.2 L 0 264.2z" pathfrom="M 0 264.2 L 0 264.2 L 152.45552884615384 264.2 L 254.09254807692307 264.2 L 355.72956730769226 264.2 L 457.3665865384615 264.2 L 559.0036057692307 264.2 L 660.640625 264.2z" /><path d="M 0 182.298C 53.35943509615384 182.298 99.09609375 158.51999999999998 152.45552884615384 158.51999999999998C 188.02848557692306 158.51999999999998 218.51959134615385 190.224 254.09254807692307 190.224C 289.6655048076923 190.224 320.1566105769231 129.458 355.72956730769226 129.458C 391.3025240384615 129.458 421.79362980769224 153.236 457.3665865384615 153.236C 492.93954326923074 153.236 523.4306490384615 47.55600000000001 559.0036057692307 47.55600000000001C 594.5765624999999 47.55600000000001 625.0676682692308 116.24799999999999 660.640625 116.24799999999999" fill="none" fillOpacity={1} stroke="#4154f1" strokeOpacity={1} strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} className="apexcharts-area" index={0} clipPath="url(#gridRectMaskcsowtm1ek)" pathto="M 0 182.298C 53.35943509615384 182.298 99.09609375 158.51999999999998 152.45552884615384 158.51999999999998C 188.02848557692306 158.51999999999998 218.51959134615385 190.224 254.09254807692307 190.224C 289.6655048076923 190.224 320.1566105769231 129.458 355.72956730769226 129.458C 391.3025240384615 129.458 421.79362980769224 153.236 457.3665865384615 153.236C 492.93954326923074 153.236 523.4306490384615 47.55600000000001 559.0036057692307 47.55600000000001C 594.5765624999999 47.55600000000001 625.0676682692308 116.24799999999999 660.640625 116.24799999999999" pathfrom="M 0 264.2 L 0 264.2 L 152.45552884615384 264.2 L 254.09254807692307 264.2 L 355.72956730769226 264.2 L 457.3665865384615 264.2 L 559.0036057692307 264.2 L 660.640625 264.2" fillRule="evenodd" /><g className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown" data:realindex={0}><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 0, 182.298 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#4154f1" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx={0} cy="182.298" shape="circle" className="apexcharts-marker no-pointer-events wuz2yygv4" rel={0} j={0} index={0} default-marker-size={4} /><path d="M 152.45552884615384, 158.51999999999998 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#4154f1" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="152.45552884615384" cy="158.51999999999998" shape="circle" className="apexcharts-marker no-pointer-events wom0husnql" rel={1} j={1} index={0} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 254.09254807692307, 190.224 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#4154f1" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="254.09254807692307" cy="190.224" shape="circle" className="apexcharts-marker no-pointer-events wnm4kqvg1" rel={2} j={2} index={0} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 355.72956730769226, 129.458 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#4154f1" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="355.72956730769226" cy="129.458" shape="circle" className="apexcharts-marker no-pointer-events whv9sp0be" rel={3} j={3} index={0} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 457.3665865384615, 153.236 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#4154f1" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="457.3665865384615" cy="153.236" shape="circle" className="apexcharts-marker no-pointer-events whx31051" rel={4} j={4} index={0} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 559.0036057692307, 47.55600000000001 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#4154f1" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="559.0036057692307" cy="47.55600000000001" shape="circle" className="apexcharts-marker no-pointer-events w2blzqsp3" rel={5} j={5} index={0} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 660.640625, 116.24799999999999 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#4154f1" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="660.640625" cy="116.24799999999999" shape="circle" className="apexcharts-marker no-pointer-events wet09yte2" rel={6} j={6} index={0} default-marker-size={4} /></g></g></g><g className="apexcharts-series" zindex={1} seriesname="Revenue" data:longestseries="true" rel={2} data:realindex={1}><path d="M 0 235.13799999999998C 53.35943509615384 235.13799999999998 99.09609375 179.656 152.45552884615384 179.656C 188.02848557692306 179.656 218.51959134615385 145.31 254.09254807692307 145.31C 289.6655048076923 145.31 320.1566105769231 179.656 355.72956730769226 179.656C 391.3025240384615 179.656 421.79362980769224 174.37199999999999 457.3665865384615 174.37199999999999C 492.93954326923074 174.37199999999999 523.4306490384615 126.816 559.0036057692307 126.816C 594.5765624999999 126.816 625.0676682692308 155.878 660.640625 155.878C 660.640625 155.878 660.640625 155.878 660.640625 264.2 L 0 264.2z" fill="url(#SvgjsLinearGradient1004)" fillOpacity={1} stroke="none" strokeOpacity={1} strokeLinecap="butt" strokeWidth={0} strokeDasharray={0} className="apexcharts-area" index={1} clipPath="url(#gridRectMaskcsowtm1ek)" pathto="M 0 235.13799999999998C 53.35943509615384 235.13799999999998 99.09609375 179.656 152.45552884615384 179.656C 188.02848557692306 179.656 218.51959134615385 145.31 254.09254807692307 145.31C 289.6655048076923 145.31 320.1566105769231 179.656 355.72956730769226 179.656C 391.3025240384615 179.656 421.79362980769224 174.37199999999999 457.3665865384615 174.37199999999999C 492.93954326923074 174.37199999999999 523.4306490384615 126.816 559.0036057692307 126.816C 594.5765624999999 126.816 625.0676682692308 155.878 660.640625 155.878C 660.640625 155.878 660.640625 155.878 660.640625 264.2 L 0 264.2z" pathfrom="M 0 264.2 L 0 264.2 L 152.45552884615384 264.2 L 254.09254807692307 264.2 L 355.72956730769226 264.2 L 457.3665865384615 264.2 L 559.0036057692307 264.2 L 660.640625 264.2z" /><path d="M 0 235.13799999999998C 53.35943509615384 235.13799999999998 99.09609375 179.656 152.45552884615384 179.656C 188.02848557692306 179.656 218.51959134615385 145.31 254.09254807692307 145.31C 289.6655048076923 145.31 320.1566105769231 179.656 355.72956730769226 179.656C 391.3025240384615 179.656 421.79362980769224 174.37199999999999 457.3665865384615 174.37199999999999C 492.93954326923074 174.37199999999999 523.4306490384615 126.816 559.0036057692307 126.816C 594.5765624999999 126.816 625.0676682692308 155.878 660.640625 155.878" fill="none" fillOpacity={1} stroke="#2eca6a" strokeOpacity={1} strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} className="apexcharts-area" index={1} clipPath="url(#gridRectMaskcsowtm1ek)" pathto="M 0 235.13799999999998C 53.35943509615384 235.13799999999998 99.09609375 179.656 152.45552884615384 179.656C 188.02848557692306 179.656 218.51959134615385 145.31 254.09254807692307 145.31C 289.6655048076923 145.31 320.1566105769231 179.656 355.72956730769226 179.656C 391.3025240384615 179.656 421.79362980769224 174.37199999999999 457.3665865384615 174.37199999999999C 492.93954326923074 174.37199999999999 523.4306490384615 126.816 559.0036057692307 126.816C 594.5765624999999 126.816 625.0676682692308 155.878 660.640625 155.878" pathfrom="M 0 264.2 L 0 264.2 L 152.45552884615384 264.2 L 254.09254807692307 264.2 L 355.72956730769226 264.2 L 457.3665865384615 264.2 L 559.0036057692307 264.2 L 660.640625 264.2" fillRule="evenodd" /><g className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown" data:realindex={1}><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 0, 235.13799999999998 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#2eca6a" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx={0} cy="235.13799999999998" shape="circle" className="apexcharts-marker no-pointer-events wtjyrsaex" rel={0} j={0} index={1} default-marker-size={4} /><path d="M 152.45552884615384, 179.656 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#2eca6a" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="152.45552884615384" cy="179.656" shape="circle" className="apexcharts-marker no-pointer-events wtsmi0iroh" rel={1} j={1} index={1} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 254.09254807692307, 145.31 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#2eca6a" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="254.09254807692307" cy="145.31" shape="circle" className="apexcharts-marker no-pointer-events w72pbbkzsj" rel={2} j={2} index={1} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 355.72956730769226, 179.656 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#2eca6a" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="355.72956730769226" cy="179.656" shape="circle" className="apexcharts-marker no-pointer-events wxlxclalc" rel={3} j={3} index={1} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 457.3665865384615, 174.37199999999999 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#2eca6a" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="457.3665865384615" cy="174.37199999999999" shape="circle" className="apexcharts-marker no-pointer-events wgexztkva" rel={4} j={4} index={1} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 559.0036057692307, 126.816 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#2eca6a" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="559.0036057692307" cy="126.816" shape="circle" className="apexcharts-marker no-pointer-events wsjxv0svn" rel={5} j={5} index={1} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 660.640625, 155.878 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#2eca6a" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="660.640625" cy="155.878" shape="circle" className="apexcharts-marker no-pointer-events wzrilx7ddi" rel={6} j={6} index={1} default-marker-size={4} /></g></g></g><g className="apexcharts-series" zindex={2} seriesname="Customers" data:longestseries="true" rel={3} data:realindex={2}><path d="M 0 224.57C 53.35943509615384 224.57 99.09609375 235.13799999999998 152.45552884615384 235.13799999999998C 188.02848557692306 235.13799999999998 218.51959134615385 179.656 254.09254807692307 179.656C 289.6655048076923 179.656 320.1566105769231 216.644 355.72956730769226 216.644C 391.3025240384615 216.644 421.79362980769224 240.422 457.3665865384615 240.422C 492.93954326923074 240.422 523.4306490384615 200.792 559.0036057692307 200.792C 594.5765624999999 200.792 625.0676682692308 235.13799999999998 660.640625 235.13799999999998C 660.640625 235.13799999999998 660.640625 235.13799999999998 660.640625 264.2 L 0 264.2z" fill="url(#SvgjsLinearGradient1005)" fillOpacity={1} stroke="none" strokeOpacity={1} strokeLinecap="butt" strokeWidth={0} strokeDasharray={0} className="apexcharts-area" index={2} clipPath="url(#gridRectMaskcsowtm1ek)" pathto="M 0 224.57C 53.35943509615384 224.57 99.09609375 235.13799999999998 152.45552884615384 235.13799999999998C 188.02848557692306 235.13799999999998 218.51959134615385 179.656 254.09254807692307 179.656C 289.6655048076923 179.656 320.1566105769231 216.644 355.72956730769226 216.644C 391.3025240384615 216.644 421.79362980769224 240.422 457.3665865384615 240.422C 492.93954326923074 240.422 523.4306490384615 200.792 559.0036057692307 200.792C 594.5765624999999 200.792 625.0676682692308 235.13799999999998 660.640625 235.13799999999998C 660.640625 235.13799999999998 660.640625 235.13799999999998 660.640625 264.2 L 0 264.2z" pathfrom="M 0 264.2 L 0 264.2 L 152.45552884615384 264.2 L 254.09254807692307 264.2 L 355.72956730769226 264.2 L 457.3665865384615 264.2 L 559.0036057692307 264.2 L 660.640625 264.2z" /><path d="M 0 224.57C 53.35943509615384 224.57 99.09609375 235.13799999999998 152.45552884615384 235.13799999999998C 188.02848557692306 235.13799999999998 218.51959134615385 179.656 254.09254807692307 179.656C 289.6655048076923 179.656 320.1566105769231 216.644 355.72956730769226 216.644C 391.3025240384615 216.644 421.79362980769224 240.422 457.3665865384615 240.422C 492.93954326923074 240.422 523.4306490384615 200.792 559.0036057692307 200.792C 594.5765624999999 200.792 625.0676682692308 235.13799999999998 660.640625 235.13799999999998" fill="none" fillOpacity={1} stroke="#ff771d" strokeOpacity={1} strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} className="apexcharts-area" index={2} clipPath="url(#gridRectMaskcsowtm1ek)" pathto="M 0 224.57C 53.35943509615384 224.57 99.09609375 235.13799999999998 152.45552884615384 235.13799999999998C 188.02848557692306 235.13799999999998 218.51959134615385 179.656 254.09254807692307 179.656C 289.6655048076923 179.656 320.1566105769231 216.644 355.72956730769226 216.644C 391.3025240384615 216.644 421.79362980769224 240.422 457.3665865384615 240.422C 492.93954326923074 240.422 523.4306490384615 200.792 559.0036057692307 200.792C 594.5765624999999 200.792 625.0676682692308 235.13799999999998 660.640625 235.13799999999998" pathfrom="M 0 264.2 L 0 264.2 L 152.45552884615384 264.2 L 254.09254807692307 264.2 L 355.72956730769226 264.2 L 457.3665865384615 264.2 L 559.0036057692307 264.2 L 660.640625 264.2" fillRule="evenodd" /><g className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown" data:realindex={2}><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 0, 224.57 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#ff771d" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx={0} cy="224.57" shape="circle" className="apexcharts-marker no-pointer-events w3i2sfge6" rel={0} j={0} index={2} default-marker-size={4} /><path d="M 152.45552884615384, 235.13799999999998 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#ff771d" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="152.45552884615384" cy="235.13799999999998" shape="circle" className="apexcharts-marker no-pointer-events wwghus8bs" rel={1} j={1} index={2} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 254.09254807692307, 179.656 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#ff771d" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="254.09254807692307" cy="179.656" shape="circle" className="apexcharts-marker no-pointer-events wgju61eth" rel={2} j={2} index={2} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 355.72956730769226, 216.644 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#ff771d" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="355.72956730769226" cy="216.644" shape="circle" className="apexcharts-marker no-pointer-events wpjm0p5h4" rel={3} j={3} index={2} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 457.3665865384615, 240.422 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#ff771d" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="457.3665865384615" cy="240.422" shape="circle" className="apexcharts-marker no-pointer-events wslsow67m" rel={4} j={4} index={2} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 559.0036057692307, 200.792 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#ff771d" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="559.0036057692307" cy="200.792" shape="circle" className="apexcharts-marker no-pointer-events wl2qe77wz" rel={5} j={5} index={2} default-marker-size={4} /></g><g className="apexcharts-series-markers" clipPath="url(#gridRectMarkerMaskcsowtm1ek)"><path d="M 660.640625, 235.13799999999998 
     m -4, 0 
     a 4,4 0 1,0 8,0 
     a 4,4 0 1,0 -8,0" fill="#ff771d" fillOpacity={1} stroke="#ffffff" strokeOpacity="0.9" strokeLinecap="butt" strokeWidth={2} strokeDasharray={0} cx="660.640625" cy="235.13799999999998" shape="circle" className="apexcharts-marker no-pointer-events wn56pkjnb" rel={6} j={6} index={2} default-marker-size={4} /></g></g></g><g className="apexcharts-datalabels" data:realindex={0} /><g className="apexcharts-datalabels" data:realindex={1} /><g className="apexcharts-datalabels" data:realindex={2} /></g><line x1={0} y1={0} x2="660.640625" y2={0} stroke="#b6b6b6" strokeDasharray={0} strokeWidth={1} strokeLinecap="butt" className="apexcharts-ycrosshairs" /><line x1={0} y1={0} x2="660.640625" y2={0} stroke="#b6b6b6" strokeDasharray={0} strokeWidth={0} strokeLinecap="butt" className="apexcharts-ycrosshairs-hidden" /><g className="apexcharts-xaxis" transform="translate(0, 0)"><g className="apexcharts-xaxis-texts-g" transform="translate(0, -4)"><text x={0} y="292.2" textAnchor="middle" dominantBaseline="auto" fontSize="12px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-xaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>00:00</tspan><title>00:00</title></text><text x="101.63701923076924" y="292.2" textAnchor="middle" dominantBaseline="auto" fontSize="12px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-xaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>01:00</tspan><title>01:00</title></text><text x="203.27403846153848" y="292.2" textAnchor="middle" dominantBaseline="auto" fontSize="12px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-xaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>02:00</tspan><title>02:00</title></text><text x="304.91105769230774" y="292.2" textAnchor="middle" dominantBaseline="auto" fontSize="12px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-xaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>03:00</tspan><title>03:00</title></text><text x="406.54807692307696" y="292.2" textAnchor="middle" dominantBaseline="auto" fontSize="12px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-xaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>04:00</tspan><title>04:00</title></text><text x="508.1850961538462" y="292.2" textAnchor="middle" dominantBaseline="auto" fontSize="12px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-xaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>05:00</tspan><title>05:00</title></text><text x="609.8221153846155" y="292.2" textAnchor="middle" dominantBaseline="auto" fontSize="12px" fontFamily="Helvetica, Arial, sans-serif" fontWeight={400} fill="#373d3f" className="apexcharts-text apexcharts-xaxis-label " style={{fontFamily: 'Helvetica, Arial, sans-serif'}}><tspan>06:00</tspan><title>06:00</title></text></g></g><g className="apexcharts-yaxis-annotations" /><g className="apexcharts-xaxis-annotations" /><g className="apexcharts-point-annotations" /></g><rect width={0} height={0} x={0} y={0} rx={0} ry={0} opacity={1} strokeWidth={0} stroke="none" strokeDasharray={0} fill="#fefefe" className="apexcharts-zoom-rect" /><rect width={0} height={0} x={0} y={0} rx={0} ry={0} opacity={1} strokeWidth={0} stroke="none" strokeDasharray={0} fill="#fefefe" className="apexcharts-selection-rect" /></svg><div className="apexcharts-tooltip apexcharts-theme-light"><div className="apexcharts-tooltip-title" style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 12}} /><div className="apexcharts-tooltip-series-group apexcharts-tooltip-series-group-0" style={{order: 1}}><span className="apexcharts-tooltip-marker" shape="circle" style={{color: 'rgb(65, 84, 241)'}} /><div className="apexcharts-tooltip-text" style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 12}}><div className="apexcharts-tooltip-y-group"><span className="apexcharts-tooltip-text-y-label" /><span className="apexcharts-tooltip-text-y-value" /></div><div className="apexcharts-tooltip-goals-group"><span className="apexcharts-tooltip-text-goals-label" /><span className="apexcharts-tooltip-text-goals-value" /></div><div className="apexcharts-tooltip-z-group"><span className="apexcharts-tooltip-text-z-label" /><span className="apexcharts-tooltip-text-z-value" /></div></div></div><div className="apexcharts-tooltip-series-group apexcharts-tooltip-series-group-1" style={{order: 2}}><span className="apexcharts-tooltip-marker" shape="circle" style={{color: 'rgb(46, 202, 106)'}} /><div className="apexcharts-tooltip-text" style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 12}}><div className="apexcharts-tooltip-y-group"><span className="apexcharts-tooltip-text-y-label" /><span className="apexcharts-tooltip-text-y-value" /></div><div className="apexcharts-tooltip-goals-group"><span className="apexcharts-tooltip-text-goals-label" /><span className="apexcharts-tooltip-text-goals-value" /></div><div className="apexcharts-tooltip-z-group"><span className="apexcharts-tooltip-text-z-label" /><span className="apexcharts-tooltip-text-z-value" /></div></div></div><div className="apexcharts-tooltip-series-group apexcharts-tooltip-series-group-2" style={{order: 3}}><span className="apexcharts-tooltip-marker" shape="circle" style={{color: 'rgb(255, 119, 29)'}} /><div className="apexcharts-tooltip-text" style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 12}}><div className="apexcharts-tooltip-y-group"><span className="apexcharts-tooltip-text-y-label" /><span className="apexcharts-tooltip-text-y-value" /></div><div className="apexcharts-tooltip-goals-group"><span className="apexcharts-tooltip-text-goals-label" /><span className="apexcharts-tooltip-text-goals-value" /></div><div className="apexcharts-tooltip-z-group"><span className="apexcharts-tooltip-text-z-label" /><span className="apexcharts-tooltip-text-z-value" /></div></div></div></div><div className="apexcharts-xaxistooltip apexcharts-xaxistooltip-bottom apexcharts-theme-light"><div className="apexcharts-xaxistooltip-text" style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 12}} /></div><div className="apexcharts-yaxistooltip apexcharts-yaxistooltip-0 apexcharts-yaxistooltip-left apexcharts-theme-light"><div className="apexcharts-yaxistooltip-text" /></div></div></div>
              {/* End Line Chart */}
            </div>
          </div>
        </div>{/* End Reports */}
        {/* Recent Sales */}
        <div className="col-12">
          <div className="card recent-sales overflow-auto">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>
                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>
            <div className="card-body">
              <h5 className="card-title">Recent Sales <span>| Today</span></h5>
              <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns"><div className="datatable-top">
                  <div className="datatable-dropdown">
                    <label>
                      <select className="datatable-selector" name="per-page"><option value={5}>5</option><option value={10} selected>10</option><option value={15}>15</option><option value={-1}>All</option></select> entries per page
                    </label>
                  </div>
                  <div className="datatable-search">
                    <input className="datatable-input" placeholder="Search..." type="search" name="search" title="Search within table" />
                  </div>
                </div>
                <div className="datatable-container"><table className="table table-borderless datatable datatable-table"><thead><tr><th scope="col" data-sortable="true" style={{width: '10.703812316715542%'}}><button className="datatable-sorter">#</button></th><th scope="col" data-sortable="true" style={{width: '23.46041055718475%'}}><button className="datatable-sorter">Customer</button></th><th scope="col" data-sortable="true" style={{width: '39.29618768328446%'}}><button className="datatable-sorter">Product</button></th><th scope="col" data-sortable="true" style={{width: '11.730205278592376%'}}><button className="datatable-sorter">Price</button></th><th scope="col" data-sortable="true" className="red" style={{width: '14.809384164222875%'}}><button className="datatable-sorter">Status</button></th></tr></thead><tbody><tr data-index={0}><td scope="row"><a href="#">#2457</a></td><td>Brandon Jacob</td><td><a href="#" className="text-primary">At praesentium minu</a></td><td>$64</td><td className="green"><span className="badge bg-success">Approved</span></td></tr><tr data-index={1}><td scope="row"><a href="#">#2147</a></td><td>Bridie Kessler</td><td><a href="#" className="text-primary">Blanditiis dolor omnis similique</a></td><td>$47</td><td className="green"><span className="badge bg-warning">Pending</span></td></tr><tr data-index={2}><td scope="row"><a href="#">#2049</a></td><td>Ashleigh Langosh</td><td><a href="#" className="text-primary">At recusandae consectetur</a></td><td>$147</td><td className="green"><span className="badge bg-success">Approved</span></td></tr><tr data-index={3}><td scope="row"><a href="#">#2644</a></td><td>Angus Grady</td><td><a href="#" className="text-primar">Ut voluptatem id earum et</a></td><td>$67</td><td className="green"><span className="badge bg-danger">Rejected</span></td></tr><tr data-index={4}><td scope="row"><a href="#">#2644</a></td><td>Raheem Lehner</td><td><a href="#" className="text-primary">Sunt similique distinctio</a></td><td>$165</td><td className="green"><span className="badge bg-success">Approved</span></td></tr></tbody></table></div>
                <div className="datatable-bottom">
                  <div className="datatable-info">Showing 1 to 5 of 5 entries</div>
                  <nav className="datatable-pagination"><ul className="datatable-pagination-list" /></nav>
                </div></div>
            </div>
          </div>
        </div>{/* End Recent Sales */}
        {/* Top Selling */}
        <div className="col-12">
          <div className="card top-selling overflow-auto">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>
                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>
            <div className="card-body pb-0">
              <h5 className="card-title">Top Selling <span>| Today</span></h5>
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col">Preview</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Sold</th>
                    <th scope="col">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row"><a href="#"><img src="admin/assets/img/product-1.jpg" alt /></a></th>
                    <td><a href="#" className="text-primary fw-bold">Ut inventore ipsa voluptas nulla</a></td>
                    <td>$64</td>
                    <td className="fw-bold">124</td>
                    <td>$5,828</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="admin/assets/img/product-2.jpg" alt /></a></th>
                    <td><a href="#" className="text-primary fw-bold">Exercitationem similique doloremque</a></td>
                    <td>$46</td>
                    <td className="fw-bold">98</td>
                    <td>$4,508</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="admin/assets/img/product-3.jpg" alt /></a></th>
                    <td><a href="#" className="text-primary fw-bold">Doloribus nisi exercitationem</a></td>
                    <td>$59</td>
                    <td className="fw-bold">74</td>
                    <td>$4,366</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="admin/assets/img/product-4.jpg" alt /></a></th>
                    <td><a href="#" className="text-primary fw-bold">Officiis quaerat sint rerum error</a></td>
                    <td>$32</td>
                    <td className="fw-bold">63</td>
                    <td>$2,016</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="admin/assets/img/product-5.jpg" alt /></a></th>
                    <td><a href="#" className="text-primary fw-bold">Sit unde debitis delectus repellendus</a></td>
                    <td>$79</td>
                    <td className="fw-bold">41</td>
                    <td>$3,239</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>{/* End Top Selling */}
      </div>
    </div>{/* End Left side columns */}
    {/* Right side columns */}
    <div className="col-lg-4">
      {/* Recent Activity */}
      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>
            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>
        <div className="card-body">
          <h5 className="card-title">Recent Activity <span>| Today</span></h5>
          <div className="activity">
            <div className="activity-item d-flex">
              <div className="activite-label">32 min</div>
              <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
              <div className="activity-content">
                Quia quae rerum <a href="#" className="fw-bold text-dark">explicabo officiis</a> beatae
              </div>
            </div>{/* End activity item*/}
            <div className="activity-item d-flex">
              <div className="activite-label">56 min</div>
              <i className="bi bi-circle-fill activity-badge text-danger align-self-start" />
              <div className="activity-content">
                Voluptatem blanditiis blanditiis eveniet
              </div>
            </div>{/* End activity item*/}
            <div className="activity-item d-flex">
              <div className="activite-label">2 hrs</div>
              <i className="bi bi-circle-fill activity-badge text-primary align-self-start" />
              <div className="activity-content">
                Voluptates corrupti molestias voluptatem
              </div>
            </div>{/* End activity item*/}
            <div className="activity-item d-flex">
              <div className="activite-label">1 day</div>
              <i className="bi bi-circle-fill activity-badge text-info align-self-start" />
              <div className="activity-content">
                Tempore autem saepe <a href="#" className="fw-bold text-dark">occaecati voluptatem</a> tempore
              </div>
            </div>{/* End activity item*/}
            <div className="activity-item d-flex">
              <div className="activite-label">2 days</div>
              <i className="bi bi-circle-fill activity-badge text-warning align-self-start" />
              <div className="activity-content">
                Est sit eum reiciendis exercitationem
              </div>
            </div>{/* End activity item*/}
            <div className="activity-item d-flex">
              <div className="activite-label">4 weeks</div>
              <i className="bi bi-circle-fill activity-badge text-muted align-self-start" />
              <div className="activity-content">
                Dicta dolorem harum nulla eius. Ut quidem quidem sit quas
              </div>
            </div>{/* End activity item*/}
          </div>
        </div>
      </div>{/* End Recent Activity */}
      {/* Budget Report */}
      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>
            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>
        <div className="card-body pb-0">
          <h5 className="card-title">Budget Report <span>| This Month</span></h5>
          <div id="budgetChart" style={{minHeight: 400, userSelect: 'none', WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}} className="echart" _echarts_instance_="ec_1741472233927"><div style={{position: 'relative', width: 716, height: 400, padding: 0, margin: 0, borderWidth: 0}}><canvas data-zr-dom-id="zr_0" width={716} height={400} style={{position: 'absolute', left: 0, top: 0, width: 716, height: 400, userSelect: 'none', WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', padding: 0, margin: 0, borderWidth: 0}} /></div></div>
        </div>
      </div>{/* End Budget Report */}
      {/* Website Traffic */}
      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>
            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>
        <div className="card-body pb-0">
          <h5 className="card-title">Website Traffic <span>| Today</span></h5>
          <div id="trafficChart" style={{minHeight: 400, userSelect: 'none', WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', position: 'relative'}} className="echart" _echarts_instance_="ec_1741472233928"><div style={{position: 'relative', width: 716, height: 400, padding: 0, margin: 0, borderWidth: 0}}><canvas data-zr-dom-id="zr_0" width={716} height={400} style={{position: 'absolute', left: 0, top: 0, width: 716, height: 400, userSelect: 'none', WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', padding: 0, margin: 0, borderWidth: 0}} /></div><div className /></div>
        </div>
      </div>{/* End Website Traffic */}
      {/* News & Updates Traffic */}
      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>
            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>
        <div className="card-body pb-0">
          <h5 className="card-title">News &amp; Updates <span>| Today</span></h5>
          <div className="news">
            <div className="post-item clearfix">
              <img src="admin/assets/img/news-1.jpg" alt />
              <h4><a href="#">Nihil blanditiis at in nihil autem</a></h4>
              <p>Sit recusandae non aspernatur laboriosam. Quia enim eligendi sed ut harum...</p>
            </div>
            <div className="post-item clearfix">
              <img src="admin/assets/img/news-2.jpg" alt />
              <h4><a href="#">Quidem autem et impedit</a></h4>
              <p>Illo nemo neque maiores vitae officiis cum eum turos elan dries werona nande...</p>
            </div>
            <div className="post-item clearfix">
              <img src="admin/assets/img/news-3.jpg" alt />
              <h4><a href="#">Id quia et et ut maxime similique occaecati ut</a></h4>
              <p>Fugiat voluptas vero eaque accusantium eos. Consequuntur sed ipsam et totam...</p>
            </div>
            <div className="post-item clearfix">
              <img src="admin/assets/img/news-4.jpg" alt />
              <h4><a href="#">Laborum corporis quo dara net para</a></h4>
              <p>Qui enim quia optio. Eligendi aut asperiores enim repellendusvel rerum cuder...</p>
            </div>
            <div className="post-item clearfix">
              <img src="admin/assets/img/news-5.jpg" alt />
              <h4><a href="#">Et dolores corrupti quae illo quod dolor</a></h4>
              <p>Odit ut eveniet modi reiciendis. Atque cupiditate libero beatae dignissimos eius...</p>
            </div>
          </div>{/* End sidebar recent posts*/}
        </div>
      </div>{/* End News & Updates */}
    </div>{/* End Right side columns */}
  </div>
</section>

    </div>
  )
}

export default Dashboard