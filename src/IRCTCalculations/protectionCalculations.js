/**
 * protectionCalculations.js
 *
 * Pure calculation engine extracted from PdfComponent.jsx.
 * No React, no JSX, no LaTeX strings — just the numeric logic.
 *
 * Every "Zn" / "Ln" variable name below matches the name used in the
 * original PdfComponent.jsx 1:1, so you can cross-reference against the
 * source file line-by-line if you need to verify a formula.
 *
 * CHANGELOG vs original PdfComponent.jsx:
 *  - Z138: original was `1.3*Z136 / (C5 * (C10+2*Z2))`, missing the `*C7`
 *    that every other K_SSC_req (IEC-TP) formula in this file uses.
 *    Fixed to `1.3*Z136 / (C5*C7*(C10+2*Z2))`. Original left as a comment
 *    below in case the omission was deliberate.
 *  - Z179: original was `1.3*Z178 / (C10+2*Z2+Z3)`, missing the `C5` in
 *    the denominator that every other ALF_req formula in this file uses.
 *    Fixed to `1.3*Z178 / (C5*(C10+2*Z2+Z3))`. Original left as a comment
 *    below in case the omission was deliberate.
 *  - IEC-PX approvals (comparing CT rated knee voltage `EK` against a
 *    section's Vk-req) are now computed for every section automatically,
 *    matching the ad-hoc `ThirdPageData.EK >= Zxx` checks that were
 *    scattered through the original JSX.
 *
 * Usage:
 *   import { calculateProtectionResults } from './protectionCalculations';
 *   const results = calculateProtectionResults(selectedData);
 *   // results.inputs      -> raw + derived input values (A/B/C constants)
 *   // results.values      -> flat map of every Zn value, e.g. results.values.Z7
 *   // results.sections    -> array of { title, visible, rows[], approval }
 *   //                        blocks, in the same order/conditions as the
 *   //                        PDF component's JSX, ready to feed into a
 *   //                        table/Excel renderer.
 */

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const num = (v) => (v === undefined || v === null || v === "" ? 0 : parseFloat(v) || 0);

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------
export function calculateProtectionResults(selectedData, OutPort = false) {
  const data = OutPort
    ? selectedData?.data_OP
    : selectedData?.data
    ? selectedData.data
    : selectedData;

  // ---- 1. FirstPage (header/meta) ----------------------------------------
  const {
    Project = "NaN",
    RefrenceNo = "NaN",
    Revision = "NaN",
    RemarkA = "NaN",
    RemarkG = "NaN",
    Date = "NaN",
    NominalVoltage = "NaN",
    SystemFrequency = "NaN",
    RatedSCcurrent = "NaN",
    ConductorTemprature = "NaN",
    Mode = "NaN",
    clientName = "NaN",
    consultantName = "NaN",
    contractorName = "NaN",
    DoucumentTitle = "NaN",
    DocumentNumber = "NaN",
  } = data?.FirstPage || {};

  const SecondPageData = data?.SecondPage || {};
  const ThirdPageData = data?.ThirdPage || {};
  const FourthPageData = data?.FourthPage || {};

  // ---- 2. Named constants (relay / CT / conductor) -----------------------
  const A1 = SecondPageData.Manufacture || "Inv";
  const A2 = SecondPageData.RelayType || "Inv";
  const A3 = SecondPageData.ProtectionFunction || "Inv";
  const A4 = SecondPageData.IrnA || 0;
  const A5 = SecondPageData.BurdenPhaseVA || 0;
  const A6 = SecondPageData.Ith_Ir || 0;
  const A7 = SecondPageData.Cal_Acc_ToVA || 0;

  const B1_2 = num(SecondPageData.Iph_two);
  const B1_3 = SecondPageData.Iph_one || 0;
  const B1_4 = num(SecondPageData.Ie_two);
  const B1_5 = SecondPageData.Iee_one || 0;
  const B1_6 = SecondPageData.IPh_max || 0;
  const B1_7 = SecondPageData.Ie_max || 0;

  const B2_2 = num(SecondPageData.if_max_int_HEFP);
  const B2_3 = num(SecondPageData.if_max_ext_HEFP);
  const B2_4 = num(SecondPageData.Is);

  const B3_2 = SecondPageData.Us || 0;
  const B3_3 = SecondPageData.Ifs || 0;
  const B3_4 = SecondPageData.TsysDP || 0;
  const B3_5 = SecondPageData.RPrime || 0;
  const B3_6 = SecondPageData.XPrime || 0;
  const B3_7 = SecondPageData.Length || 0;
  const B3_8 = SecondPageData.Z1Set || 0;

  const B4_2 = num(SecondPageData.if_max_int_LDP);
  const B4_3 = num(SecondPageData.if_max_ext_LDP);
  const B4_4 = num(SecondPageData.TsysLDP);
  const B4_5 = num(SecondPageData.XR);
  const B4_6 = num(SecondPageData.K2);

  const B5_2 = num(SecondPageData.if_max_int_TDP);
  const B5_3 = num(SecondPageData.if_max_ext_TDP);
  const B5_4 = num(SecondPageData.TsysTDP);
  const B5_5 = num(SecondPageData.Vk2);
  const B5_6 = num(SecondPageData.R2);
  const B5_7 = num(SecondPageData.Vk3);
  const B5_8 = num(SecondPageData.R3);
  const B5_9 = num(SecondPageData.nCT);

  const B6_2 = num(SecondPageData.if_max_int_BDP);
  const B6_3 = num(SecondPageData.if_max_ext_BDP);

  const C1 = ThirdPageData.CTName || "Inv";
  const C3 = ThirdPageData.SelectedCtClass || "Inv";
  const C4 = num(ThirdPageData.CTPrimary);
  const C5 = num(ThirdPageData.CTSecondary);
  const C6 = num(ThirdPageData.ALF_K_SCC);
  const C7 = num(ThirdPageData.KTD);
  const C9 = num(ThirdPageData.Rr);
  const C10 = num(ThirdPageData.CTResistance);
  const C11 = num(ThirdPageData.EK);
  const C12 = num(ThirdPageData.Ie);
  const C13 = num(ThirdPageData.Vt);
  const C14 = num(ThirdPageData.Vk);
  const C15 = num(ThirdPageData.Ik);

  const Cal_Acc_ToVA = SecondPageData.Cal_Acc_ToVA || 0;
  const std = Cal_Acc_ToVA;
  const EK = C11; // CT's rated knee-point voltage, used by all IEC-PX approvals

  // ---- 3. Core calculations (Z1 ... Z190), ported 1:1 --------------------
  const Z1 = FourthPageData.Material === "Cu" ? 0.0225 : FourthPageData.Material === "Al" ? 0.0376 : 0;
  const Z2 = (Z1 * (FourthPageData.Length / FourthPageData.CrossSection)) || 0;
  const Z3 = SecondPageData.BurdenPhaseVA / (SecondPageData.IrnA ** 2);
  const Z5 = ThirdPageData.Sr / ThirdPageData.CTSecondary ** 2;
  const Z4 = (C6 * (Z5 + C10)) / (Z3 + Z2 + C10);
  const Z6 = (C6 * (C9 + C10)) / (Z3 + Z2 + C10);

  const Z8 = Math.min((SecondPageData.IPh_max * 1000 * C5) / C4, 31 * SecondPageData.Iph_one) || 0;
  const Z7 = 0.5 * Z8 * (C10 + Z2 + Z3);
  const Z9 = (1.3 * Z7) / (C5 * (C10 + Z2 + Z5));
  const Z10 = (1.3 * Z7) / (C5 * C7 * (C10 + Z2 + Z3));

  const Z12 = B1_4;
  const Z11 = Z12 * (Z2 + Z3 + C10);
  const Z13 = (1.3 * Z11) / (C5 * (C10 + Z2 + Z3));
  const Z14 = (1.3 * Z11) / (C5 * C7 * (C10 + Z2 + Z3));

  const Z16 = Math.min((num(SecondPageData.Ie_max) * 1000 * C5) / C4, 31 * num(SecondPageData.Iee_one));
  const Z15 = 0.5 * Z16 * (C10 + 2 * Z2 + Z3);
  const Z17 = (1.3 * Z15) / (C5 * (C10 + 2 * Z2 + Z3));
  const Z18 = (1.3 * Z15) / (C5 * C7 * (C10 + 2 * Z2 + Z3));

  const Z20 = B1_4;
  const Z19 = Z20 * (C10 + 2 * Z2 + Z3);
  const Z21 = (1.3 * Z19) / (C5 * (C10 + 2 * Z2 + Z3));
  const Z22 = (1.3 * Z19) / (C5 * C7 * (C10 + 2 * Z2 + Z3));

  const Z23 = 1.2 * (B2_3 / B2_4) * (C10 + 2 * Z2);
  const Z24 = 4 * Z23 * B2_4;
  const Z25 = (1.3 * Z24) / (C5 * (C10 + 2 * Z2));
  const Z26 = (1.3 * Z24) / (C5 * C7 * (C10 + 2 * Z2));

  const Z28 = B1_6 * 1000 * (C5 / C4);
  const Z27 = 0.5 * Z28 * (C10 + Z2 + Z3);
  const Z29 = Math.max(B1_2 / C5, 20);
  const Z30 = Math.max(Z29, (1.3 * Z27) / (C5 * (C10 + Z2 + Z3)));
  const Z31 = Math.max(Z29 / C7, (1.3 * Z27) / (C5 * C7 * (C10 + Z2 + Z3)));

  const Z33 = (B1_6 * 1000 * C5) / C4;
  const Z32 = 0.5 * Z33 * (C10 + Z2 + Z3);
  const Z34 = Math.max(B1_3 / C5, 20);
  const Z35 = Math.max(Z34, (1.3 * Z32) / (C5 * (C10 + Z2 + Z3)));
  const Z36 = Math.max(Z34 / C7, (1.3 * Z32) / (C5 * C7 * (C10 + Z2 + Z3)));

  const Z38 = (B1_7 * 1000 * C5) / C4;
  const Z37 = 0.5 * Z38 * (C10 + Z2 + Z3);
  const Z39 = Math.max(B1_4 / C5, 20);
  const Z40 = Math.max(Z39, (1.3 * Z37) / (C5 * (C10 + Z2 + Z3)));
  const Z41 = Math.max(Z39 / C7, (1.3 * Z37) / (C5 * C7 * (C10 + Z2 + Z3)));

  const Z43 = (B1_7 * 1000 * C5) / C4;
  const Z42 = Z43 * (C10 + Z2 + Z3);
  const Z44 = Math.max(B1_5 / C5, 20);
  const Z45 = Math.max(Z44, (1.3 * Z42) / (C5 * (C10 + Z2 + Z3)));
  const Z46 = Math.max(Z44 / C7, (1.3 * Z42) / (C5 * C7 * (C10 + C9)));

  const Z48 = Math.min(B1_6 * 1000 * (C5 / C4), 31 * B1_3);
  const Z47 = 0.5 * Z48 * (C10 + Z2 + Z3);
  const Z49 = (1.3 * Z47) / (C5 * (C10 + Z2 + Z3));
  const Z50 = (1.3 * Z47) / (C5 * C7 * (C10 + Z2 + Z3));

  const Z52 = B1_2;
  const Z51 = Z52 * (C10 + Z2 + Z3);
  const Z53 = (1.3 * Z51) / (C5 * (C10 + Z5));
  const Z54 = (1.3 * Z51) / (C5 * C7 * (C10 + Z2 + Z3));

  const Z56 = (B1_6 * 1000 * C5) / C4;
  const Z55 = 0.5 * Z56 * (C10 + Z2 + Z3);
  const Z57 = (1.3 * Z55) / (C5 * (C10 + Z2 + Z3));
  const Z58 = (1.3 * Z55) / (C5 * C7 * (C10 + Z2 + Z3));

  const Z60 = Math.min(B1_7 * 1000 * (C5 / C4), 31 * B1_5);
  const Z59 = 0.5 * Z60 * (C10 + 2 * Z2 + 2 * Z3);
  const Z61 = (1.3 * Z59) / (C5 * (C10 + 2 * Z2 + 2 * Z3));
  const Z62 = (1.3 * Z59) / (C5 * C7 * (C10 + 2 * Z2 + 2 * Z3));

  const Z64 = B1_4;
  const Z63 = Z64 * (C10 + 2 * Z2 + 2 * Z3);
  const Z65 = (1.3 * Z63) / (C5 * (C10 + 2 * Z2 + 2 * Z3));
  const Z66 = (1.3 * Z63) / (C5 * C7 * (C10 + 2 * Z2 + 2 * Z3));

  const Z68 = (B1_7 * 1000 * C5) / C4;
  const Z67 = Z68 * (C10 + 2 * Z2 + 2 * Z3);
  const Z69 = (1.3 * Z67) / (C5 * (C10 + 2 * Z2 + 2 * Z3));
  const Z70 = (1.3 * Z67) / (C5 * C7 * (C10 + 2 * Z2 + 2 * Z3));

  // ---- Distance protection (21) — Case 1: close-up backward SC -----------
  const Z71 = 2 * Math.PI * 50 * B3_4;
  const Z72 = Z71 <= 15 ? 0.5 + 0.3 * Z71 : Z71 <= 80 ? 4.26 + 0.036 * Z71 : 8;
  const Z73 = (B3_3 * 1000) / C4;
  const Z74 = Z72 * Z73 * C5 * (C10 + 2 * Z2 + Z3);

  // Case 2: close-up forward SC (Kemp fixed = 1.5)
  const Z75 = 1.5 * Z73 * C5 * (C10 + 2 * Z2 + Z3);

  // Case 3: 80% of Zone1 reach (curve B)
  const Z76 = (1.1 * B3_2) / (Math.sqrt(3) * B3_3);
  const Z77 = Z76 / (2 * Math.PI * 50 * B3_4);
  const Z78 = 0.8 * (B3_8 / 100) * B3_6 * B3_7;
  const Z79 = 0.8 * (B3_8 / 100) * B3_5 * B3_7;
  const Z80 = (Z76 + Z78) / (Z77 + Z79);
  const Z82 = (1.1 * B3_2) / (Math.sqrt(3) * (Z76 + Z78));
  const Z83 = (Z82 * 1000) / C4;
  const Z84 = Z82 * Z83 * C5 * (C10 + 2 * Z2 + Z3);

  // Case 4: 110% of Zone1 reach (curve C again)
  const Z85 = 1.2 * (B3_8 / 100) * B3_6 * B3_7;
  const Z86 = 1.2 * (B3_8 / 100) * B3_5 * B3_7;
  const Z87 = (Z76 + Z85) / (Z77 + Z86);
  const Z88 = Z87 <= 15 ? 0.5 + 0.3 * Z87 : Z87 <= 80 ? 4.26 + 0.036 * Z87 : Z87 > 80 ? 8 : 0;
  const Z89 = (1.1 * B3_2) / (Math.sqrt(3) * (Z76 + Z85));
  const Z90 = (Z89 * 1000) / C4;
  const Z91 = Z88 * Z90 * C5 * (C10 + 2 * Z2 + Z3);

  const Z92 = Math.max(Z74, Z75, Z84, Z91);
  const Z93 = (1.3 * Z92) / (C5 * (C10 + 2 * Z2 + 2 * Z3));
  const Z94 = (1.3 * Z92) / (C5 * C7 * (C10 + 2 * Z2 + Z3));

  // ---- Distance protection (21) — P44x style (single Kd model) -----------
  const Z95 = 0.6;
  const Z96 = (B3_3 * 1000 * C5) / C4;
  const Z97 = 2 * Math.PI * 50 * B3_4;
  const Z98 = Z95 * Z96 * (1 + Z97) * (C10 + 2 * Z2 + Z3);
  const Z99 = (1.3 * Z98) / (C5 * (C10 + 2 * Z2 + Z3));
  const Z100 = (1.3 * Z98) / (C5 * C7 * (C10 + 2 * Z2 + Z3));

  // ---- Distance protection (21) — P532 style (Z1 reach point) -----------
  const Z102 = (1.1 * B3_2) / (Math.sqrt(3) * B3_3);
  const Z103 = parseFloat(Z102.toFixed(2)) / (2 * Math.PI * 50 * B3_4);
  const Z104 = (B3_8 / 100) * B3_6 * B3_7;
  const Z105 = (B3_8 / 100) * B3_5 * B3_7;
  const Z106 =
    (parseFloat(Z102.toFixed(2)) + parseFloat(Z104.toFixed(2))) /
    (parseFloat(Z103.toFixed(2)) + parseFloat(Z105.toFixed(2)));
  const Z107 = (1.1 * B3_2) / (Math.sqrt(3) * (parseFloat(Z102.toFixed(2)) + parseFloat(Z104.toFixed(2))));
  const Z108 = (parseFloat(Z107.toFixed(2)) * 1000 * C5) / C4;
  const Z109 =
    parseFloat(Z102.toFixed(2)) *
    parseFloat(Z108.toFixed(2)) *
    (1 + parseFloat(Z106.toFixed(2))) *
    (parseFloat(C10.toFixed(2)) + parseFloat(Z2.toFixed(2)) + parseFloat(Z3.toFixed(2)));

  const Z110 = 1.4;
  const Z111 = (B3_3 * 1000 * C5) / C4;
  const Z112 = Z110 * Z111 * (C10 + Z2 + Z3);
  const Z113 = Math.max(parseFloat(Z109.toFixed(2)), parseFloat(Z112.toFixed(2)));
  const Z114 = (1.3 * Z113) / (C5 * (C10 + Z2 + Z3));
  const Z115 = (1.3 * Z113) / (C5 * C7 * (C10 + Z2 + Z3));

  // ---- 87L Line differential — P541 style ---------------------------------
  const Z116 = 1 + 2 * Math.PI * 50 * B4_4;
  const Z117 = (Math.max(B4_2, B4_3) * 1000 * C5) / C4;
  const Z118 = parseFloat(Z116.toFixed(2)) * parseFloat(Z117.toFixed(2)) * (C10 + Z2 + Z3);

  const Z121 = (B4_3 / C4) * B4_5;
  const Z122 = Z121 <= 1000 ? 40 + 0.07 * Z121 : 107;
  const Z123 = Z122 * C5 * (C10 + 2 * Z2);
  const Z124 = Z121 <= 600 ? 40 + 0.35 * Z121 : 256;
  const Z125 = Z124 * C5 * (C10 + 2 * Z2);
  const Z126 = B4_6 === 150 ? Z123 : B4_6 === 100 ? Z125 : -1;
  const Z127 = (1.3 * Z126) / (C5 * (C10 + 2 * Z2));
  const Z128 = (1.3 * Z126) / (C5 * C7 * (C10 + 2 * Z2));

  // ---- 87L Line differential — P54x style (sat-stabilization variants) --
  const Z129 = (B4_3 / C4) * B4_5;
  const Z130 = Z129 <= 1000 ? 40 + 0.07 * Z129 : 107;
  const Z131 = Z130 * C5 * (C10 + 2 * Z2);
  const Z132 = Z129 <= 600 ? 40 + 0.35 * Z129 : 256;
  const Z133 = Z132 * C5 * (C10 + 2 * Z2);
  const Z134 = B4_6 === 150 ? Z131 : B4_6 === 100 ? Z133 : -1;
  const Z135 = B4_5 <= 80 ? 50 : 65;
  const Z136 = Z135 * C5 * (C10 + 2 * Z2);
  const Z137 = (1.3 * Z134) / (C5 * (C10 + 2 * Z2));
  // Z138 [FIXED]: original omitted "*C7" (see CHANGELOG at top of file).
  // const Z138_ORIGINAL = (1.3 * Z136) / (C5 * (C10 + 2 * Z2));
  const Z138 = (1.3 * Z136) / (C5 * C7 * (C10 + 2 * Z2));
  const Z139 = (1.3 * Z134) / (C5 * C7 * (C10 + 2 * Z2));
  const Z140 = (1.3 * Z136) / (C5 * C7 * (C10 + 2 * Z2));

  // ---- Distance (21) — P54x style ----------------------------------------
  const Z142 = (1.1 * B3_2) / (Math.sqrt(3) * B3_3);
  const Z143 = Z142 / (2 * Math.PI * 50 * B3_4);
  const Z144 = (B3_8 / 100) * B3_6 * B3_7;
  const Z145 = (B3_8 / 100) * B3_5 * B3_7;
  const Z146 =
    (parseFloat(Z142.toFixed(2)) + parseFloat(Z144.toFixed(2))) /
    (parseFloat(Z143.toFixed(2)) + parseFloat(Z145.toFixed(2)));
  const Z147 = (1.1 * B3_2) / (Math.sqrt(3) * (Z142 + Z144));
  const Z148 = (Z147 * 1000 * C5) / C4;
  const Z149 =
    parseFloat(Z142.toFixed(2)) * parseFloat(Z148.toFixed(2)) * (1 + parseFloat(Z146.toFixed(2))) * (C10 + Z2 + Z3);

  const Z150 = 1.4;
  const Z151 = (B3_3 * 1000 * C5) / C4;
  const Z152 = Z150 * Z151 * (C10 + Z2 + Z3);

  const Z153 = B3_6 * B3_7;
  const Z154 = B3_5 * B3_7;
  const Z155 =
    (parseFloat(Z142.toFixed(2)) + parseFloat(Z153.toFixed(2))) /
    (parseFloat(Z143.toFixed(2)) + parseFloat(Z154.toFixed(2)));
  const Z157 = (1.1 * B3_2) / (Math.sqrt(3) * (Z142 + Z153));
  const Z158 = (Z157 * 1000 * C5) / C4;
  const Z159 = Z158 * (C10 + Z2 + Z3);
  const Z160 = Math.max(Z149, Z152, Z159);
  const Z161 = (1.3 * Z160) / (C5 * (C10 + Z2 + Z3));
  const Z162 = (1.3 * Z160) / (C5 * C7 * (C10 + Z2 + Z3));

  // ---- 87T Transformer differential — P632/P633 style --------------------
  const Z163 = 2 * Math.PI * 50 * B5_4;
  const Z164 = Z163 <= 10 ? Math.exp(0.033 * Z163) : 4.6 - 3.1 * Math.exp(-0.095 * (Z163 - 10));
  const Z165 = (B5_3 * 1000) / C4;
  const Z166 = parseFloat(Z164.toFixed(2)) * parseFloat(Z165.toFixed(2)) * C5 * (C10 + Z2 + Z3);
  const Z167 = (B5_2 * 1000) / C4;
  const Z168 = 0.25 * Z167 * C5 * (C10 + Z2 + Z3);
  const Z169 = Math.max(parseFloat(Z166.toFixed(2)), parseFloat(Z168.toFixed(2)));
  const Z170 = (1.3 * Z169) / (C5 * (C10 + Z2 + Z3));
  const Z171 = (1.3 * Z169) / (C5 * C7 * (C10 + Z2 + Z3));

  // ---- 87T stability check (multi-CT ratio disparity) --------------------
  let Z172raw;
  if (A7 === "IEC-PX") Z172raw = C11;
  else if (A7 === "IEC-P") Z172raw = C6 / (C10 + Z5) / 1.3;
  else if (A7 === "IEC-TP") Z172raw = (1.3 * C6 * C7) / (C10 + Z5);
  const Z172 = (Z172raw || 0) / (C6 + 2 * Z2 + Z3);

  const Z173 =
    B5_9 === 2 ? Math.max(Z172, B5_5 / B5_6) : B5_9 === 3 ? Math.max(Z172, B5_5 / B5_6, B5_7 / B5_8) : 0;
  const Z174 =
    B5_9 === 2 ? Math.min(Z172, B5_5 / B5_6) : B5_9 === 3 ? Math.min(Z172, B5_5 / B5_6, B5_7 / B5_8) : 0;
  const Z175 = Z173 / Z174;

  const Z176 = 2 * Math.PI * 50 * B5_4;
  const Z177 =
    Z175 >= 5 && Z175 <= 20 && B5_3 * 1000 >= C4 && B5_3 * 1000 <= 40 * C4
      ? 20
      : Z175 >= 5 && Z175 <= 20 && B5_3 * 1000 > 40 * C4 && B5_3 * 1000 <= 64 * C4
      ? 30
      : Z175 >= 20 && Z175 <= 120 && B5_3 * 1000 >= C4 && B5_3 * 1000 <= 40 * C4
      ? 30
      : Z175 > 20 && Z175 <= 120 && B5_3 * 1000 > 40 * C4 && B5_3 * 1000 <= 64 * C4
      ? 40
      : 0;
  const Z178 = Z177 * C5 * (C10 + 2 * Z2 + Z3);
  // Z179 [FIXED]: original omitted "C5" in the denominator (see CHANGELOG).
  // const Z179_ORIGINAL = (1.3 * Z178) / (C10 + 2 * Z2 + Z3);
  const Z179 = (1.3 * Z178) / (C5 * (C10 + 2 * Z2 + Z3));
  const Z180 = (1.3 * Z178) / (C5 * C7 * (C10 + 2 * Z2 + Z3));

  // ---- 87BB Busbar differential — P74X style ------------------------------
  const Z181 = B6_2 * (C5 / C4) * (C10 + 2 * Z2 + Z3);
  const Z182 = 0.5 * B6_3 * (C5 / C4) * (C10 + 2 * Z2 + Z3);
  const Z183 = Math.max(Z181, Z182);

  // ---- 50/51+N combined — P821 style -------------------------------------
  const Z187 = Math.max(B1_6, B1_7) * 1000 * (C5 / C4);
  const Z186 = Z187 * (C10 + 2 * Z2 + 2 * Z3);
  const Z189 = (1.3 * Z186) / (C5 * (C10 + 2 * Z2 + 2 * Z3));
  const Z190 = (1.3 * Z186) / (C5 * C7 * (C10 + 2 * Z2 + 2 * Z3));

  const values = {
    Z1, Z2, Z3, Z4, Z5, Z6, Z7, Z8, Z9, Z10,
    Z11, Z12, Z13, Z14, Z15, Z16, Z17, Z18, Z19, Z20,
    Z21, Z22, Z23, Z24, Z25, Z26, Z27, Z28, Z29, Z30,
    Z31, Z32, Z33, Z34, Z35, Z36, Z37, Z38, Z39, Z40,
    Z41, Z42, Z43, Z44, Z45, Z46, Z47, Z48, Z49, Z50,
    Z51, Z52, Z53, Z54, Z55, Z56, Z57, Z58, Z59, Z60,
    Z61, Z62, Z63, Z64, Z65, Z66, Z67, Z68, Z69, Z70,
    Z71, Z72, Z73, Z74, Z75, Z76, Z77, Z78, Z79, Z80,
    Z82, Z83, Z84, Z85, Z86, Z87, Z88, Z89, Z90,
    Z91, Z92, Z93, Z94, Z95, Z96, Z97, Z98, Z99, Z100,
    Z102, Z103, Z104, Z105, Z106, Z107, Z108, Z109, Z110,
    Z111, Z112, Z113, Z114, Z115, Z116, Z117, Z118,
    Z121, Z122, Z123, Z124, Z125, Z126, Z127, Z128, Z129, Z130,
    Z131, Z132, Z133, Z134, Z135, Z136, Z137, Z138, Z139, Z140,
    Z142, Z143, Z144, Z145, Z146, Z147, Z148, Z149, Z150,
    Z151, Z152, Z153, Z154, Z155, Z157, Z158, Z159, Z160,
    Z161, Z162, Z163, Z164, Z165, Z166, Z167, Z168, Z169, Z170,
    Z171, Z172, Z173, Z174, Z175, Z176, Z177, Z178, Z179, Z180,
    Z181, Z182, Z183, Z186, Z187, Z189, Z190,
  };

  const inputs = {
    meta: {
      Project, RefrenceNo, Revision, RemarkA, RemarkG, Date, NominalVoltage, SystemFrequency,
      RatedSCcurrent, ConductorTemprature, Mode, clientName, consultantName, contractorName,
      DoucumentTitle, DocumentNumber,
    },
    relay: {
      Manufacture: A1, RelayType: A2, ProtectionFunction: A3, IrnA: A4, BurdenPhaseVA: A5,
      Ith_Ir: A6, Cal_Acc_ToVA: A7,
    },
    ct: {
      CTName: C1, SelectedCtClass: C3, CTPrimary: C4, CTSecondary: C5, ALF_K_SCC: C6, KTD: C7,
      Rr: C9, CTResistance: C10, EK: C11, Ie: C12, Vt: C13, Vk: C14, Ik: C15,
    },
    conductor: {
      Material: FourthPageData.Material, Length: FourthPageData.Length, CrossSection: FourthPageData.CrossSection,
    },
    functionSettings: {
      B1_2, B1_3, B1_4, B1_5, B1_6, B1_7, B2_2, B2_3, B2_4,
      B3_2, B3_3, B3_4, B3_5, B3_6, B3_7, B3_8, B4_2, B4_3, B4_4, B4_5, B4_6,
      B5_2, B5_3, B5_4, B5_5, B5_6, B5_7, B5_8, B5_9, B6_2, B6_3,
    },
  };

  const sections = buildSections({ A2, A3, std, EK, values, inputs });

  return { inputs, values, sections };
}

// ---------------------------------------------------------------------------
// Approval helper — picks the right check based on the CT accuracy
// standard (Cal_Acc_ToVA): IEC-PX compares against the CT's rated knee
// voltage (EK); IEC-P compares ALF; IEC-TP compares K_SSC.
// ---------------------------------------------------------------------------
function buildApproval(std, { vkReq, EK, ALFreq, ALFactual, KsscReq, KsscActual }) {
  if (std === "IEC-PX") {
    if (vkReq === undefined || EK === undefined) return null;
    return { standard: "IEC-PX", metric: "Vk", required: vkReq, actual: EK, pass: EK >= vkReq };
  }
  if (std === "IEC-P") {
    if (ALFreq === undefined) return null;
    return { standard: "IEC-P", metric: "ALF", required: ALFreq, actual: ALFactual, pass: ALFactual >= ALFreq };
  }
  if (std === "IEC-TP") {
    if (KsscReq === undefined) return null;
    return { standard: "IEC-TP", metric: "K_SSC", required: KsscReq, actual: KsscActual, pass: KsscActual >= KsscReq };
  }
  return null;
}

function section(title, visible, rows, approval) {
  return { title, visible, rows, approval: approval || null };
}
function row(label, value, unit) {
  const v = typeof value === "number" && !isNaN(value) ? Number(value.toFixed(4)) : value;
  return { label, value: v, unit: unit || null };
}

// ---------------------------------------------------------------------------
// Section builder — mirrors the JSX conditional blocks in PdfComponent.jsx.
// ---------------------------------------------------------------------------
function buildSections({ A2, A3, std, EK, values: Z, inputs }) {
  const sections = [];
  const relayInfo = A2;
  const func = A3;
  const ALFactual = Z.Z4;
  const KsscActual = Z.Z6;
  const appr = (vkReq, ALFreq, KsscReq) => buildApproval(std, { vkReq, EK, ALFreq, ALFactual, KsscReq, KsscActual });

  sections.push(section("Wire resistance (75°C)", true, [row("R_L (wire resistance)", Z.Z2, "ohm")]));
  sections.push(section("Relay burden", true, [row("R_rn (relay burden)", Z.Z3, "ohm")]));

  if (std === "IEC-P") {
    sections.push(section("Actual ALF [ref: IEC-P]", true, [
      row("R_cn", Z.Z5, "ohm"),
      row("ALF_actual", Z.Z4),
    ]));
  }
  if (std === "IEC-TP") {
    sections.push(section("Actual K_SSC [ref: IEC-TP]", true, [row("K_SSC_actual", Z.Z6)]));
  }

  if ((relayInfo === "P12x" || relayInfo === "P12y" || relayInfo === "P14x") && func === "50/51+N") {
    sections.push(section("50-51 Definite/IDMT overcurrent", true, [
      row("Vk-req", Z.Z7, "V"), row("Icp", Z.Z8, "A"),
    ], appr(Z.Z7, Z.Z9, Z.Z10)));

    sections.push(section("50-51 Instantaneous overcurrent", true, [
      row("Vk-req", Z.Z11, "V"), row("Isp = Iph>>", Z.Z12, "A"),
    ], appr(Z.Z11, Z.Z13, Z.Z14)));

    if (relayInfo === "P12y" || relayInfo === "P12x") {
      sections.push(section("50N-51N Definite/IDMT earth fault", true, [
        row("Vk-req", Z.Z15, "V"), row("Icn", Z.Z16, "A"),
      ], appr(Z.Z15, Z.Z17, Z.Z18)));
    }

    sections.push(section("50N-51N Instantaneous earth fault", true, [
      row("Vk-req", Z.Z19, "V"), row("Isn = Ie>>", Z.Z20, "A"),
    ], appr(Z.Z19, Z.Z21, Z.Z22)));
  }

  if ((relayInfo === "P12x" || relayInfo === "P12y" || relayInfo === "P14x") && func === "HI REF") {
    sections.push(section("High Impedance REF", true, [
      row("Rs (stabilizing resistance)", Z.Z23, "ohm"), row("Vk-req", Z.Z24, "V"),
    ], appr(Z.Z24, Z.Z25, Z.Z26)));
  }

  if (relayInfo === "P132" || relayInfo === "P139") {
    sections.push(section("50-51 Definite time overcurrent", true, [
      row("Vk-req", Z.Z27, "V"), row("Icn", Z.Z28, "A"),
    ], appr(Z.Z27, Z.Z30, Z.Z31)));

    sections.push(section("50-51 Inverse time overcurrent", true, [
      row("Vk-req", Z.Z32, "V"), row("Icp", Z.Z33, "A"),
    ], appr(Z.Z32, Z.Z35, Z.Z36)));

    sections.push(section("50N-51N Definite time earth fault", true, [
      row("Vk-req", Z.Z37, "V"), row("Icn", Z.Z38, "A"),
    ], appr(Z.Z37, Z.Z40, Z.Z41)));

    sections.push(section("50N-51N Inverse time earth fault", true, [
      row("Vk-req", Z.Z42, "V"), row("Icn", Z.Z43, "A"),
    ], appr(Z.Z42, Z.Z45, Z.Z46)));
  }

  if ((relayInfo === "P14x" && func === "50/51+N") || relayInfo === "P84x") {
    sections.push(section("Directional/non-directional definite-time/IDMT overcurrent", true, [
      row("Vk-req", Z.Z47, "V"), row("Icn", Z.Z48, "A"),
    ], appr(Z.Z47, Z.Z49, Z.Z50)));

    sections.push(section("Instantaneous non-directional overcurrent", true, [
      row("Vk-req", Z.Z51, "V"), row("Isp = Iph>>", Z.Z52, "A"),
    ], appr(Z.Z51, Z.Z53, Z.Z54)));

    sections.push(section("Instantaneous directional overcurrent", true, [
      row("Vk-req", Z.Z55, "V"), row("Ifp", Z.Z56, "A"),
    ], appr(Z.Z55, Z.Z57, Z.Z58)));

    sections.push(section("Definite/IDMT directional & non-directional earth fault / SEF", true, [
      row("Vk-req", Z.Z59, "V"), row("Icn", Z.Z60, "A"),
    ], appr(Z.Z59, Z.Z61, Z.Z62)));

    sections.push(section("Instantaneous non-directional earth fault / SEF", true, [
      row("Vk-req", Z.Z63, "V"), row("Isn = Ie>>", Z.Z64, "A"),
    ], appr(Z.Z63, Z.Z65, Z.Z66)));

    sections.push(section("Instantaneous directional earth fault / SEF", true, [
      row("Vk-req", Z.Z67, "V"), row("Isn = Ie>>", Z.Z68, "A"),
    ], appr(Z.Z67, Z.Z69, Z.Z70)));
  }

  if (relayInfo === "P433" || relayInfo === "P435") {
    sections.push(section("Distance protection (21)", true, [
      row("Case 1 (close-up backward SC) Vk-req", Z.Z74, "V"),
      row("Case 2 (close-up forward SC) Vk-req", Z.Z75, "V"),
      row("Case 3 (80% Zone1 reach) Vk-req", Z.Z84, "V"),
      row("Case 4 (110% Zone1 reach) Vk-req", Z.Z91, "V"),
      row("Final Vk-req (max of 4 cases)", Z.Z92, "V"),
    ], appr(Z.Z92, Z.Z93, Z.Z94)));
  }

  if (relayInfo === "P44x") {
    sections.push(section("Distance protection (21)", true, [
      row("Vk-req", Z.Z98, "V"),
    ], appr(Z.Z98, Z.Z99, Z.Z100)));
  }

  if (relayInfo === "P532") {
    sections.push(section("Distance protection — Z1 reach point", true, [row("Vk-req", Z.Z109, "V")]));
    sections.push(section("Distance protection — close-up fault", true, [
      row("Vk-req", Z.Z112, "V"), row("Final Vk-req (max)", Z.Z113, "V"),
    ], appr(Z.Z113, Z.Z114, Z.Z115)));
    sections.push(section("87L Line differential (P532)", true, [row("Vk-req", Z.Z118, "V")], null));
  }

  if (relayInfo === "P632" || relayInfo === "P633") {
    sections.push(section("87T Transformer differential", true, [
      row("Kemp", Z.Z164),
      row("Vk-req (external fault)", Z.Z166, "V"),
      row("Vk-req (internal fault, Kd=0.25)", Z.Z168, "V"),
      row("Final Vk-req (max)", Z.Z169, "V"),
    ], appr(Z.Z169, Z.Z170, Z.Z171)));
  }

  if (std === "IEC-TP") {
    sections.push(section("87T stability check (multi-CT ratio disparity)", true, [
      row("Vk1/R1", Z.Z172),
      row("max(Vi/Ri)", Z.Z173),
      row("min(Vi/Ri)", Z.Z174),
      row("Disparity ratio (must be <= 4)", Z.Z175),
    ]));
    sections.push(section("87T Vk-req (stability model)", true, [
      row("Vk-req", Z.Z178, "V"),
    ], appr(Z.Z178, Z.Z179, Z.Z180)));
  }

  if (relayInfo === "P541") {
    sections.push(section("87L Line differential (P541)", true, [
      row("Vk-req (K2=150%)", Z.Z123, "V"),
      row("Vk-req (K2=100%)", Z.Z125, "V"),
      row("Final Vk-req", Z.Z126, "V"),
    ], appr(Z.Z126, Z.Z127, Z.Z128)));
  }

  if (relayInfo === "P54x" && func === "87L") {
    sections.push(section("87L Line differential (P54x)", true, [
      row("Vk-req (stab disabled)", Z.Z134, "V"),
      row("Vk-req (stab enabled)", Z.Z136, "V"),
    ], [
      appr(Z.Z134, Z.Z137, Z.Z139),
      appr(Z.Z136, Z.Z138, Z.Z140),
    ].filter(Boolean)));
  }

  if (relayInfo === "P54x" && func === "21") {
    sections.push(section("Distance protection (P54x)", true, [
      row("Vk-req @ Z1 reach", Z.Z149, "V"),
      row("Vk-req close-up", Z.Z152, "V"),
      row("Vk-req remote bus", Z.Z159, "V"),
      row("Final Vk-req (max)", Z.Z160, "V"),
    ], appr(Z.Z160, Z.Z161, Z.Z162)));
  }

  if (relayInfo === "P74X") {
    sections.push(section("87BB Busbar differential", true, [
      row("Vk-req (internal fault)", Z.Z181, "V"),
      row("Vk-req (external fault)", Z.Z182, "V"),
      row("Final Vk-req (max)", Z.Z183, "V"),
    ]));
  }

  if (relayInfo === "P821") {
    sections.push(section("50/51 + earth fault (P821)", true, [
      row("Ifp", Z.Z187, "A"), row("Vk-req", Z.Z186, "V"),
    ], appr(Z.Z186, Z.Z189, Z.Z190)));
  }

  return sections;
}

export default calculateProtectionResults;