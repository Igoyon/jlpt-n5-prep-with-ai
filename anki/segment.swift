// Pokazuje, jak syntezator (Kyoko) dzieli tekst na słowa. Podział „は | つか” albo „へ | や” = błędne czytanie.
// Kompilacja i użycie (z katalogu projektu):
//   swiftc anki/segment.swift -o anki/.segment && anki/.segment "じゅうがつ　はつかです" "部屋で　たばこを"
import AppKit
class D: NSObject, NSSpeechSynthesizerDelegate {
  var words: [String] = []; var done = false
  func speechSynthesizer(_ s: NSSpeechSynthesizer, willSpeakWord r: NSRange, of t: String) { words.append((t as NSString).substring(with: r)) }
  func speechSynthesizer(_ s: NSSpeechSynthesizer, didFinishSpeaking ok: Bool) { done = true }
}
let voice = NSSpeechSynthesizer.availableVoices.filter { $0.rawValue.contains("ja-JP.Kyoko") }.sorted { $0.rawValue < $1.rawValue }.last!
let s = NSSpeechSynthesizer(voice: voice)!
let tmp = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("segment.aiff")
for t in CommandLine.arguments.dropFirst() {
  let d = D(); s.delegate = d
  s.startSpeaking(t, to: tmp)
  while !d.done { RunLoop.current.run(until: Date() + 0.05) }
  print(t, "=>", d.words.joined(separator: " | "))
}
