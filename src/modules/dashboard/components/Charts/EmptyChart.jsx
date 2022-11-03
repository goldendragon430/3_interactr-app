import React from "react";

export function EmptyChart({children}){
  return(
    <div className="grid">
      <div className="col12">
        <div style={{border: '1px solid #ccc', height: '540px', width: '100%', textAlign: 'center', borderRadius: '20px'}}>
          <h2 style={{ marginTop: '235px', lineHeight: '40px'}}>{children}</h2>
        </div>
      </div>
    </div>
  );
}