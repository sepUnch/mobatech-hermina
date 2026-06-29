import os
import re

# Remove unused imports
router_file = "mobatech-flutter/lib/core/routes/app_router_parts.dart"
if os.path.exists(router_file):
    with open(router_file, "r") as f:
        content = f.read()
    content = re.sub(r"import\s+'\.\./\.\./core/providers/mock_ui_providers\.dart';\n", "", content)
    with open(router_file, "w") as f:
        f.write(content)

cart_repo_file = "mobatech-flutter/lib/features/pharmacy/data/cart_repository.dart"
if os.path.exists(cart_repo_file):
    with open(cart_repo_file, "r") as f:
        content = f.read()
    content = re.sub(r"import\s+'medicine_repository\.dart';\n", "", content)
    with open(cart_repo_file, "w") as f:
        f.write(content)

# Fix unused refresh in home_screen_widgets.dart
home_widgets = "mobatech-flutter/lib/features/home/presentation/screens/home_screen_widgets.dart"
if os.path.exists(home_widgets):
    with open(home_widgets, "r") as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        if "final refresh = " in line:
            lines[i] = line.replace("final refresh = ", "") # just call the function instead of assigning
        if "prefer_interpolation_to_compose_strings" in line:
            pass # we can ignore or let dart handle it, actually let's fix interpolation manually
        if 'title + " (" + count.toString() + ")"' in line:
            lines[i] = line.replace('title + " (" + count.toString() + ")"', '\"$title ($count)\"')
    with open(home_widgets, "w") as f:
        f.writelines(lines)

# Fix context synchronously in prescription_card.dart
rx_card = "mobatech-flutter/lib/features/pharmacy/presentation/widgets/prescription_card.dart"
if os.path.exists(rx_card):
    with open(rx_card, "r") as f:
        content = f.read()
    content = content.replace("ScaffoldMessenger.of(context).showSnackBar", "if (!context.mounted) return;\n      ScaffoldMessenger.of(context).showSnackBar")
    with open(rx_card, "w") as f:
        f.write(content)
