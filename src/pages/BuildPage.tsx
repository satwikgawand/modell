export default function BuildPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">build your own LLM</h1>
        <p className="text-sm" style={{ color: '#64748b' }}>drag-and-drop architecture sandbox</p>
      </div>
      <div
        className="rounded-xl p-12 text-center"
        style={{ background: '#0f0f1a', border: '1px solid #1e1e35' }}
      >
        <p className="text-4xl mb-4">🏗️</p>
        <p className="text-base font-semibold text-white mb-2">coming in phase 4</p>
        <p className="text-sm" style={{ color: '#64748b' }}>
          drag components, tune sliders, get a brainrot verdict on the architecture you built.
        </p>
        <p className="text-xs font-mono mt-4" style={{ color: '#3d3d6b' }}>
          dnd-kit · zustand · react three fiber sandbox scene
        </p>
      </div>
    </div>
  )
}
