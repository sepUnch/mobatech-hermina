import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/pharmacy_provider.dart';
import 'catalog_tab_view_components.dart';

class CatalogTabView extends ConsumerStatefulWidget {
  const CatalogTabView({super.key});

  @override
  ConsumerState<CatalogTabView> createState() => _CatalogTabViewState();
}

class _CatalogTabViewState extends ConsumerState<CatalogTabView> {
  int? _selectedCategoryId;
  String? _searchQuery;
  Timer? _debounce;
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      setState(() {
        _searchQuery = query.isEmpty ? null : query;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final categoriesAsync = ref.watch(categoriesProvider);
    final medicinesAsync = ref.watch(medicinesProvider(
      (categoryId: _selectedCategoryId, search: _searchQuery),
    ));

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(categoriesProvider);
        ref.invalidate(medicinesProvider);
      },
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          SearchAndCategories(
            searchController: _searchController,
            onSearchChanged: _onSearchChanged,
            selectedCategoryId: _selectedCategoryId,
            onCategorySelected: (id) => setState(() => _selectedCategoryId = id),
            categoriesAsync: categoriesAsync,
          ),
          MedicinesList(medicinesAsync: medicinesAsync),
          const SliverPadding(padding: EdgeInsets.only(bottom: 24)),
        ],
      ),
    );
  }
}
