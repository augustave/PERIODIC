// js/data/mission-threads.js — Mission thread definitions
import { MAGNET_REES, CHINA_REES_ALL, BATTERY_CRITICAL, BATTERY_SECONDARY } from './minerals-operations.js';

export const MISSION_THREADS = {
  magnet_supply_chain: {
    label: "Magnet Supply Chain",
    dataset: "ree",
    scenario: "magnet",
    panel: "topology",
    elements: () => new Set([...MAGNET_REES]),
    kg: ["lree", "hree", "bastnasite", "monazite", "permmagnet", "china", "exportcontrols", "forge", "r3", "r6"],
    narrative: "Tracks Nd, Pr, Dy, and Tb from mineral hosts through separation, magnet manufacturing, policy support, and substitution pressure."
  },
  china_dependency: {
    label: "China Dependency",
    dataset: "ree",
    scenario: "china",
    panel: "topology",
    elements: () => new Set([...CHINA_REES_ALL]),
    kg: ["lree", "hree", "china", "exportcontrols", "metallization", "equipmentshortage", "forge", "r1", "r2", "r8"],
    narrative: "Surfaces the export-control exposure layer and the institutional responses that reduce dependency on Chinese processing and equipment bottlenecks."
  },
  ev_bottleneck: {
    label: "EV Bottleneck",
    dataset: "lithium",
    scenario: "battery",
    panel: "operations",
    elements: () => new Set([...BATTERY_CRITICAL, ...BATTERY_SECONDARY]),
    kg: ["evmotors", "china", "projectvault", "r4", "r6", "r7"],
    narrative: "Constrains the interface to battery-critical materials, funded operations, and chemistry/substitution pressure around EV scale-up."
  },
  heavy_ree_access: {
    label: "Heavy REE Access",
    dataset: "ree",
    scenario: null,
    panel: "minerals",
    elements: () => new Set([39, 65, 66, 67, 68, 69, 70, 71]),
    kg: ["hree", "ionclays", "eudialyte", "china", "australia", "brazil", "japan", "r2", "r4", "r7"],
    narrative: "Focuses on yttrium and heavy rare earth access, where ion clays, eudialyte hosts, recycling, and strategic reserves matter most."
  }
};
