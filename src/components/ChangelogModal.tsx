import { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';

interface ChangelogModalProps {
  onClose: () => void;
  changelog: string;
}

interface Version {
  title: string;
  sections: Section[];
}

interface Section {
  title: string;
  items: string[];
}

export function ChangelogModal({ onClose, changelog }: ChangelogModalProps) {
  // Parse changelog into versions
  const versions = parseChangelog(changelog);
  
  // First version open by default
  const [openVersions, setOpenVersions] = useState<Record<number, boolean>>({
    0: true
  });

  const toggleVersion = (index: number) => {
    setOpenVersions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content changelog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Changelog</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="changelog-versions">
            {versions.map((version, versionIndex) => (
              <div key={versionIndex} className="changelog-version-block">
                <button
                  className="changelog-version-header"
                  onClick={() => toggleVersion(versionIndex)}
                >
                  {openVersions[versionIndex] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  <h3 className="changelog-version" dangerouslySetInnerHTML={{ __html: renderMarkdown(version.title) }}></h3>
                </button>
                
                {openVersions[versionIndex] && (
                  <div className="changelog-version-content">
                    {version.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="changelog-section-block">
                        <h4 className="changelog-section" dangerouslySetInnerHTML={{ __html: renderMarkdown(section.title) }}></h4>
                        <ul className="changelog-list">
                          {section.items.map((item, itemIndex) => (
                            <li 
                              key={itemIndex} 
                              className="changelog-item" 
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(item) }}
                            />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function parseChangelog(changelog: string): Version[] {
  const versions: Version[] = [];
  const lines = changelog.split('\n');
  
  let currentVersion: Version | null = null;
  let currentSection: Section | null = null;
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Save previous version
      if (currentVersion) {
        if (currentSection) {
          currentVersion.sections.push(currentSection);
        }
        versions.push(currentVersion);
      }
      
      // Start new version
      currentVersion = {
        title: line.replace('## ', ''),
        sections: []
      };
      currentSection = null;
    } else if (line.startsWith('### ') && currentVersion) {
      // Save previous section
      if (currentSection) {
        currentVersion.sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: line.replace('### ', ''),
        items: []
      };
    } else if (line.startsWith('- ') && currentSection) {
      currentSection.items.push(line.replace('- ', ''));
    }
  }
  
  // Save last version
  if (currentVersion) {
    if (currentSection) {
      currentVersion.sections.push(currentSection);
    }
    versions.push(currentVersion);
  }
  
  return versions;
}

function renderMarkdown(text: string): string {
  if (!text) return '';
  
  return text
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code: `code`
    .replace(/`(.*?)`/g, '<code>$1</code>');
}
